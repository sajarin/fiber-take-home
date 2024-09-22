import { Button, VStack, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { Set } from "immutable";
import { Domain, showToast } from "../lib/resources";

interface CartActionsProps {
  domainCart: Set<Domain>;
  setDomainCart: (cart: Set<Domain>) => void;
  numDomainsRequired: number;
  canPurchase: boolean;
  onCopyToClipboard: () => void;
}

/**
 * CartActions component provides various actions for the domain cart,
 * such as clearing the cart, removing unavailable domains, copying to clipboard,
 * keeping the best domains, and handling checkout.
 *
 * @param domainCart - The set of domains in the cart.
 * @param setDomainCart - Function to update the domain cart.
 * @param numDomainsRequired - Number of domains required for purchase.
 * @param canPurchase - Flag indicating if domains can be purchased.
 * @param onCopyToClipboard - Function to handle copy to clipboard action.
 */
const CartActions: React.FC<CartActionsProps> = ({
  domainCart,
  setDomainCart,
  numDomainsRequired,
  canPurchase,
  onCopyToClipboard,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Clears all domains from the cart and shows a toast notification.
   */
  const clearCart = () => {
    setDomainCart(Set());
    showToast(toast, "Cart cleared successfully", "info");
  };

  /**
   * Removes all unavailable domains from the cart and shows a toast notification.
   */
  const removeUnavailableDomains = () => {
    setDomainCart(
      domainCart.filter((domain) => domain.isAvailable === true) as Set<Domain>
    );
    showToast(toast, "Unavailable domains removed", "info");
  };

  /**
   * Keeps the best domains in the cart based on predefined criteria and the number of required domains.
   * The criteria for evaluation are:
   * 1. Top-level domain (TLD) preference order: .com, .app, .xyz
   * 2. Shorter domain names are preferred.
   *
   * The function sorts the domains using the above criteria, slices the sorted list to retain only
   * the number of domains as specified by `numDomainsRequired`, updates the cart with these domains,
   * and shows a toast notification.
   */
  const keepBestDomains = () => {
    const sortedDomains = domainCart
      .sort((a, b) => {
        const tldOrder = [".com", ".app", ".xyz"];
        const aTldIndex = tldOrder.findIndex((tld) => a.name.endsWith(tld));
        const bTldIndex = tldOrder.findIndex((tld) => b.name.endsWith(tld));

        // If TLDs differ, sort by the predefined TLD preference order
        if (aTldIndex !== bTldIndex) return aTldIndex - bTldIndex;

        // If TLDs are the same, sort by domain name length (shorter is better)
        return a.name.length - b.name.length;
      })
      .slice(0, numDomainsRequired); // Keep only the top `numDomainsRequired` domains

    setDomainCart(Set(sortedDomains)); // Update the cart with the selected best domains
    showToast(toast, `Kept the best ${numDomainsRequired} domains`, "info"); // Show a toast notification
  };

  /**
   * Copies the content to clipboard and shows a toast notification.
   */
  const copyToClipboard = () => {
    onCopyToClipboard();
    showToast(toast, "Copied to clipboard", "info");
  };

  /**
   * Handles the checkout process, simulates an API call (delay of 2 seconds) to register domains,
   * and shows appropriate toast notifications based on the outcome.
   */
  const handleCheckout = async () => {
    setIsLoading(true);
    showToast(toast, "Processing checkout...", "info");

    try {
      // Simulate an API call to register domains
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay of 2 seconds

      const registeredDomains = domainCart.filter(
        (domain) => domain.isAvailable
      );
      const numOfRegisteredDomains = registeredDomains.size;
      if (numOfRegisteredDomains > 0) {
        showToast(
          toast,
          `${numOfRegisteredDomains} Domain(s) registered successfully`,
          "success"
        );
        setDomainCart(Set()); // Clear the cart
      } else {
        showToast(toast, "No available domains to register", "warning");
      }
    } catch (error) {
      showToast(toast, "Failed to register domains", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack mt={4} spacing={4} align="stretch">
      <Button onClick={clearCart}>Clear Cart</Button>
      <Button onClick={removeUnavailableDomains}>
        Remove Unavailable Domains
      </Button>
      <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
      <Button onClick={keepBestDomains}>Keep Best Domains</Button>
      <Button
        onClick={handleCheckout}
        isDisabled={!canPurchase || isLoading}
        bg="fiber_purple"
        color="white"
        _hover={{ bg: "fiber_purple", opacity: 0.8 }}
        _disabled={{ opacity: 0.6 }}
      >
        {isLoading ? "Processing..." : "Checkout"}
      </Button>
    </VStack>
  );
};

export default CartActions;
