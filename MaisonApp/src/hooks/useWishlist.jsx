import { createContext, useContext, useState, useEffect } from "react";
import { HttpService } from "../services/httpService";
import { useDebouncedCallback } from "use-debounce";

const WishlistContext = createContext();

const isLoggedIn = () => !!localStorage.getItem("authToken");

export function WishlistProvider({ children }) {
    const [wishlistId, setWishlistId] = useState(null);
    const [wishlist, setWishlist] = useState(() => {
        if (!isLoggedIn()) {
            try {
                return JSON.parse(localStorage.getItem("wishlist")) || {};
            } catch (e) {
                return {};
            }
        }
        return {};
    });

    useEffect(() => {
        if (isLoggedIn()) {
            HttpService.getWishlist().then(async (data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setWishlist(data[0].items || {});
                    setWishlistId(data[0].id);
                } else {
                    try {
                        const newWish = await HttpService.createWishlist({ items: {} });
                        setWishlist(newWish.items || {});
                        setWishlistId(newWish.id);
                    } catch (e) {
                        console.error("Failed to create initial wishlist:", e);
                    }
                }
            }).catch(err => {
                console.error("Failed to fetch wishlist:", err);
            });
        }
    }, []);

    const persistWishlist = (newWishlist) => {
        if (isLoggedIn()) {
            if (wishlistId) {
                try {
                    HttpService.updateWishlist(wishlistId, { items: newWishlist }).catch(err => {
                        console.error("Failed to save wishlist to backend:", err);
                    });
                } catch (e) {
                    console.error("Failed to save wishlist to backend:", e);
                }
            } else {
                try {
                    HttpService.createWishlist({ items: newWishlist }).then(data => {
                        setWishlistId(data.id);
                    }).catch(err => {
                        console.error("Failed to save wishlist to backend:", err);
                    });
                } catch (e) {
                    console.error("Failed to save wishlist to backend:", e);
                }
            }
        }
    };

    const debouncedSaveWishlist = useDebouncedCallback(persistWishlist, 500);
    const saveWishlist = (newWishlist) => {
        setWishlist(newWishlist);
        localStorage.setItem("wishlist", JSON.stringify(newWishlist));
        debouncedSaveWishlist(newWishlist);
    };

    const addToWishlist = (product) => {
        const newWishlist = { ...wishlist };
        if (newWishlist[product.id]) {
            return;
        } else {
            newWishlist[product.id] = product;
        }
        saveWishlist(newWishlist);
    };

    const removeFromWishlist = (product) => {
        const newWishlist = { ...wishlist };
        delete newWishlist[product.id];
        saveWishlist(newWishlist);
    };

    const value = {
        wishlist,
        addToWishlist,
        removeFromWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};