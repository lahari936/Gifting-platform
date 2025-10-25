
import React, { useState, useMemo } from 'react';
import { Product, CartItem, Occasion } from './types';
import { PRODUCTS, OCCASIONS } from './constants';
import ProductCard from './components/ProductCard';
import GiftFinder from './components/GiftFinder';
import { ShoppingCartIcon, ArrowLeftIcon, XIcon, PlusIcon, MinusIcon } from './components/Icons';

const App: React.FC = () => {
    const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        if (selectedOccasion === 'all') {
            return PRODUCTS;
        }
        return PRODUCTS.filter(p => p.occasion.includes(selectedOccasion));
    }, [selectedOccasion]);

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
    };

    const handleBackToList = () => {
        setSelectedProduct(null);
    };

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.id !== productId);
            }
            return prevCart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
        });
    };
    
    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);

    const cartItemCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);


    const Header = () => (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 onClick={handleBackToList} className="text-3xl font-playfair font-bold text-givora-charcoal cursor-pointer">GIVORA</h1>
                <button onClick={() => setIsCartOpen(true)} className="relative">
                    <ShoppingCartIcon className="w-8 h-8 text-gray-600 hover:text-givora-charcoal transition-colors" />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-givora-pink text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );

    const CartSidebar = () => (
        <>
        <div 
            className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsCartOpen(false)}
        />
        <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-40 transform transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold">Your Gift Box</h2>
                    <button onClick={() => setIsCartOpen(false)}><XIcon className="w-6 h-6" /></button>
                </div>
                <div className="flex-grow overflow-y-auto p-4">
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-500 mt-8">Your gift box is empty.</p>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center mb-4">
                                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                                <div className="flex-grow">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                    <div className="flex items-center mt-2">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 border rounded-full"><MinusIcon className="w-4 h-4" /></button>
                                        <span className="mx-3 font-bold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 border rounded-full"><PlusIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-4 border-t">
                    <div className="flex justify-between items-center font-bold text-lg mb-4">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={() => alert('Proceeding to checkout!')}
                        disabled={cart.length === 0}
                        className="w-full bg-givora-charcoal text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                        Checkout
                    </button>
                </div>
            </div>
        </div>
        </>
    );

    const ProductDetailView = () => (
        <div className="container mx-auto p-4 md:p-8">
            <button onClick={handleBackToList} className="flex items-center text-gray-600 hover:text-givora-charcoal mb-8">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to all gifts
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                    <img src={selectedProduct!.imageUrl} alt={selectedProduct!.name} className="w-full h-auto object-cover rounded-xl shadow-lg"/>
                </div>
                <div>
                    <p className="text-sm text-gray-500">{selectedProduct!.seller}</p>
                    <h2 className="text-4xl font-playfair font-bold my-2">{selectedProduct!.name}</h2>
                    <p className="text-3xl font-semibold text-givora-pink-dark my-4">${selectedProduct!.price.toFixed(2)}</p>
                    <p className="text-gray-700 leading-relaxed mb-8">{selectedProduct!.description}</p>
                    <button onClick={() => addToCart(selectedProduct!)} className="w-full md:w-auto bg-givora-charcoal text-white font-bold py-3 px-12 rounded-lg hover:bg-gray-700 transition-colors">
                        Add to Gift Box
                    </button>
                </div>
            </div>
        </div>
    );
    
    const HomeView = () => (
        <>
            <div className="text-center py-16 px-4 bg-givora-pink/20">
                <h2 className="text-4xl md:text-5xl font-playfair font-extrabold mb-2">Where giving feels gorgeous.</h2>
                <p className="max-w-2xl mx-auto text-lg text-gray-600">Discover unique gifts from the best boutique sellers, curated for every occasion.</p>
            </div>
            <div className="container mx-auto p-4 md:p-8">
                <GiftFinder />
                <div className="mb-8 flex flex-wrap justify-center gap-2">
                    {OCCASIONS.map(occasion => (
                        <button
                            key={occasion.id}
                            onClick={() => setSelectedOccasion(occasion.id)}
                            className={`px-4 py-2 text-sm md:text-base rounded-full transition-colors ${
                                selectedOccasion === occasion.id
                                    ? 'bg-givora-charcoal text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                            }`}
                        >
                            {occasion.emoji} {occasion.name}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} onProductClick={handleProductClick} />
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen">
            <Header />
            <main>
                {selectedProduct ? <ProductDetailView /> : <HomeView />}
            </main>
            <CartSidebar />
            <footer className="bg-gray-100 text-center p-8 mt-12">
                <p className="font-playfair text-xl font-bold">GIVORA</p>
                <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} - The Art of Gifting, Simplified.</p>
            </footer>
        </div>
    );
};

export default App;
