import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Product,
  Feature,
  FAQ,
  WebsiteContent,
  ContactMessage,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_FEATURES,
  INITIAL_FAQS,
  INITIAL_WEBSITE_CONTENT,
} from '../lib/sampleData';

interface DataContextType {
  products: Product[];
  features: Feature[];
  faqs: FAQ[];
  websiteContent: WebsiteContent;
  messages: ContactMessage[];
  loading: boolean;
  isSeeding: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<string>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearAllProducts: () => Promise<void>;
  addFeature: (feature: Omit<Feature, 'id'>) => Promise<string>;
  updateFeature: (id: string, feature: Partial<Feature>) => Promise<void>;
  deleteFeature: (id: string) => Promise<void>;
  addFaq: (faq: Omit<FAQ, 'id'>) => Promise<string>;
  updateFaq: (id: string, faq: Partial<FAQ>) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  updateWebsiteContent: (section: 'hero' | 'about' | 'footer' | 'theme', data: any) => Promise<void>;
  submitContactMessage: (msg: { name: string; email: string; subject: string; message: string }) => Promise<void>;
  updateMessageStatus: (id: string, status: 'unread' | 'read') => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  seedInitialDataToFirestore: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper to strip undefined values so Firestore does not throw "Unsupported field value: undefined"
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return (obj === undefined ? null : obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}

// Helper to ensure Firestore operations fail fast instead of hanging the UI indefinitely
const withTimeout = <T,>(promise: Promise<T>, timeoutMs = 15000, opName = 'Operation'): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `${opName} timed out. Please check your internet connection and verify Firestore permissions.`
            )
          ),
        timeoutMs
      )
    ),
  ]);
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [features, setFeatures] = useState<Feature[]>(INITIAL_FEATURES);
  const [faqs, setFaqs] = useState<FAQ[]>(INITIAL_FAQS);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(INITIAL_WEBSITE_CONTENT);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Subscribe in real-time to Products
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            items.push({
              id: docSnap.id,
              title: data.title || '',
              shortDescription: data.shortDescription || '',
              description: data.description || '',
              price: data.price || '$0',
              category: data.category || 'General',
              badge: data.badge || '',
              images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'],
              purchaseLink: data.purchaseLink || '#',
              features: Array.isArray(data.features) ? data.features : [],
              status: data.status || 'active',
              createdAt: data.createdAt || '',
            });
          });
          setProducts(items);
        } else {
          setProducts([]);
        }
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Subscribe to Features
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'features'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Feature[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            items.push({
              id: docSnap.id,
              icon: data.icon || 'Sparkles',
              heading: data.heading || '',
              description: data.description || '',
              order: data.order ?? 0,
            });
          });
          items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setFeatures(items);
        } else {
          setFeatures(INITIAL_FEATURES);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'features');
      }
    );

    return () => unsub();
  }, []);

  // Subscribe to FAQs
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'faqs'),
      (snapshot) => {
        if (!snapshot.empty) {
          const items: FAQ[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            items.push({
              id: docSnap.id,
              question: data.question || '',
              answer: data.answer || '',
              order: data.order ?? 0,
            });
          });
          items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setFaqs(items);
        } else {
          setFaqs(INITIAL_FAQS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'faqs');
      }
    );

    return () => unsub();
  }, []);

  // Subscribe to Website Content (Hero, About, Footer)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'website_content'),
      (snapshot) => {
        if (!snapshot.empty) {
          const newContent = { ...INITIAL_WEBSITE_CONTENT };
          snapshot.forEach((docSnap) => {
            const id = docSnap.id;
            const data = docSnap.data();
            if (id === 'hero' && data) {
              newContent.hero = { ...INITIAL_WEBSITE_CONTENT.hero, ...data };
            } else if (id === 'about' && data) {
              newContent.about = { ...INITIAL_WEBSITE_CONTENT.about, ...data };
            } else if (id === 'footer' && data) {
              newContent.footer = { ...INITIAL_WEBSITE_CONTENT.footer, ...data };
            } else if (id === 'theme' && data) {
              newContent.theme = { ...INITIAL_WEBSITE_CONTENT.theme, ...data };
            }
          });
          setWebsiteContent(newContent);
        } else {
          setWebsiteContent(INITIAL_WEBSITE_CONTENT);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'website_content');
      }
    );

    return () => unsub();
  }, []);

  // Subscribe to Messages
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'messages'),
      (snapshot) => {
        const items: ContactMessage[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          items.push({
            id: docSnap.id,
            name: data.name || '',
            email: data.email || '',
            subject: data.subject || '',
            message: data.message || '',
            createdAt: data.createdAt || new Date().toISOString(),
            status: data.status || 'unread',
          });
        });
        items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setMessages(items);
      },
      (error) => {
        // Only admins can read messages; suppress or handle error gracefully if visitor
        console.warn('Messages listener restricted or unauthenticated');
      }
    );

    return () => unsub();
  }, []);

  // Product CRUD
  const addProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
    const cleanProduct = sanitizeForFirestore({
      title: product.title.trim(),
      shortDescription: product.shortDescription?.trim() || '',
      description: product.description?.trim() || '',
      price: product.price.trim(),
      category: product.category?.trim() || 'Planners & OS',
      badge: product.badge?.trim() || '',
      images:
        product.images && product.images.length > 0
          ? product.images
          : ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'],
      purchaseLink: product.purchaseLink.trim(),
      features: Array.isArray(product.features) ? product.features : [],
      status: product.status || 'active',
      createdAt: product.createdAt || new Date().toISOString().split('T')[0],
    });

    try {
      const docRef = await withTimeout(
        addDoc(collection(db, 'products'), cleanProduct),
        15000,
        'Saving product to Firestore'
      );
      setProducts((prev) => [
        { id: docRef.id, ...cleanProduct },
        ...prev.filter((p) => p.id !== docRef.id),
      ]);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
      throw error;
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
    const sanitized = sanitizeForFirestore({
      ...product,
      ...(product.title ? { title: product.title.trim() } : {}),
      ...(product.shortDescription !== undefined ? { shortDescription: product.shortDescription.trim() } : {}),
      ...(product.description !== undefined ? { description: product.description.trim() } : {}),
      ...(product.price ? { price: product.price.trim() } : {}),
      ...(product.purchaseLink ? { purchaseLink: product.purchaseLink.trim() } : {}),
      ...(product.badge !== undefined ? { badge: product.badge.trim() } : {}),
    });

    // Instant optimistic update across all views and modals
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...sanitized } : p))
    );

    try {
      await withTimeout(
        setDoc(doc(db, 'products', id), sanitized, { merge: true }),
        15000,
        'Updating product'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
      throw error;
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await withTimeout(
        deleteDoc(doc(db, 'products', id)),
        12000,
        'Deleting product'
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      throw error;
    }
  };

  const clearAllProducts = async (): Promise<void> => {
    try {
      for (const p of products) {
        await withTimeout(
          deleteDoc(doc(db, 'products', p.id)),
          8000,
          `Removing product ${p.title}`
        );
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'products');
      throw error;
    }
  };

  // Feature CRUD
  const addFeature = async (feature: Omit<Feature, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'features'), {
        icon: feature.icon,
        heading: feature.heading,
        description: feature.description,
        order: feature.order ?? features.length + 1,
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'features');
      throw error;
    }
  };

  const updateFeature = async (id: string, feature: Partial<Feature>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'features', id), { ...feature });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `features/${id}`);
      throw error;
    }
  };

  const deleteFeature = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'features', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `features/${id}`);
      throw error;
    }
  };

  // FAQ CRUD
  const addFaq = async (faq: Omit<FAQ, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'faqs'), {
        question: faq.question,
        answer: faq.answer,
        order: faq.order ?? faqs.length + 1,
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'faqs');
      throw error;
    }
  };

  const updateFaq = async (id: string, faq: Partial<FAQ>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'faqs', id), { ...faq });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `faqs/${id}`);
      throw error;
    }
  };

  const deleteFaq = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'faqs', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `faqs/${id}`);
      throw error;
    }
  };

  // Website Content
  const updateWebsiteContent = async (section: 'hero' | 'about' | 'footer' | 'theme', data: any): Promise<void> => {
    const sanitized = sanitizeForFirestore(data);

    // Optimistic instant update across the live site and admin panel
    setWebsiteContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...sanitized,
      },
    }));

    try {
      await withTimeout(
        setDoc(doc(db, 'website_content', section), sanitized, { merge: true }),
        15000,
        `Saving ${section} content`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `website_content/${section}`);
      throw error;
    }
  };

  // Submit Contact Form
  const submitContactMessage = async (msg: { name: string; email: string; subject: string; message: string }): Promise<void> => {
    try {
      await addDoc(collection(db, 'messages'), {
        name: msg.name.trim(),
        email: msg.email.trim(),
        subject: msg.subject.trim() || 'General Inquiry',
        message: msg.message.trim(),
        createdAt: new Date().toISOString(),
        status: 'unread',
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
      throw error;
    }
  };

  const updateMessageStatus = async (id: string, status: 'unread' | 'read'): Promise<void> => {
    try {
      await updateDoc(doc(db, 'messages', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `messages/${id}`);
      throw error;
    }
  };

  const deleteMessage = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `messages/${id}`);
      throw error;
    }
  };

  // One-click Seed Initial Data to Firestore
  const seedInitialDataToFirestore = async (): Promise<void> => {
    setIsSeeding(true);
    try {
      // Seed products
      for (const prod of INITIAL_PRODUCTS) {
        const { id, ...data } = prod;
        await setDoc(doc(db, 'products', id), data);
      }
      // Seed features
      for (const feat of INITIAL_FEATURES) {
        const { id, ...data } = feat;
        await setDoc(doc(db, 'features', id), data);
      }
      // Seed FAQs
      for (const faq of INITIAL_FAQS) {
        const { id, ...data } = faq;
        await setDoc(doc(db, 'faqs', id), data);
      }
      // Seed Website Content
      await setDoc(doc(db, 'website_content', 'hero'), INITIAL_WEBSITE_CONTENT.hero);
      await setDoc(doc(db, 'website_content', 'about'), INITIAL_WEBSITE_CONTENT.about);
      await setDoc(doc(db, 'website_content', 'footer'), INITIAL_WEBSITE_CONTENT.footer);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'seed_data');
      throw error;
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        products,
        features,
        faqs,
        websiteContent,
        messages,
        loading,
        isSeeding,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        addFeature,
        updateFeature,
        deleteFeature,
        addFaq,
        updateFaq,
        deleteFaq,
        updateWebsiteContent,
        submitContactMessage,
        updateMessageStatus,
        deleteMessage,
        seedInitialDataToFirestore,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
