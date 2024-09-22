import React, { useState } from "react";
import { Box, VStack, Text, useToast } from "@chakra-ui/react";
import DomainInput from "./DomainInput";
import DomainList from "./DomainList";
import CartActions from "./CartActions";
import CartStatus from "./CartStatus";
import { Domain, showToast } from "../lib/resources";
import { Set } from "immutable";
import { useClipboard } from "@chakra-ui/react";

interface DomainChallengeProps {
  maxDomains: number;
  numDomainsRequired: number;
}

/**
 * DomainChallenge component manages the state and actions of the domain selection process
 * including adding/removing domains, showing cart status, and handling checkout actions.
 *
 * @param maxDomains - The maximum number of domains allowed in the cart.
 * @param numDomainsRequired - The number of domains required to proceed to checkout.
 */
const DomainChallenge: React.FC<DomainChallengeProps> = ({
  maxDomains,
  numDomainsRequired,
}) => {
  // State management for the domain cart
  const [domainCart, setDomainCart] = useState<Set<Domain>>(Set());

  // Clipboard handler for copying domain names to clipboard
  const { onCopy } = useClipboard(
    domainCart.map((domain) => domain.name).join(", ")
  );

  // Toast notifications
  const toast = useToast();

  /**
   * Adds a new domain to the cart if it's not already present.
   * Shows a toast notification based on domain availability.
   *
   * @param domain - The domain to be added.
   */
  const addDomain = (domain: Domain) => {
    if (!domainCart.some((d) => d.name === domain.name)) {
      setDomainCart(domainCart.add(domain));
      showToast(
        toast,
        `Domain ${domain.name} is ${
          domain.isAvailable ? "available" : "unavailable"
        }.`,
        domain.isAvailable ? "success" : "error"
      );
    } else {
      showToast(toast, `Domain ${domain.name} is already in the cart.`, "info");
    }
  };

  /**
   * Removes a domain from the cart based on its name.
   *
   * @param domainToRemove - The name of the domain to be removed.
   */
  const removeDomain = (domainToRemove: string) => {
    setDomainCart(
      domainCart.filter(
        (domain) => domain.name !== domainToRemove
      ) as Set<Domain>
    );
  };

  // Determine if the required number of domains have been added to the cart
  const canPurchase = domainCart.size === numDomainsRequired;

  return (
    <Box p={4}>
      <Box mb={12} style={{ textAlign: "center" }}>
        <Text fontSize="4xl" fontWeight="bold" as="h1" color="fiber_purple">
          Prune
        </Text>
        <Text fontSize="sm" as="h2">
          {" "}
          <em>A constipation-free domain searching experience</em>
        </Text>
      </Box>

      <VStack spacing={4} align="stretch">
        <CartStatus currentCount={domainCart.size} maxCount={maxDomains} />
        <DomainInput
          onAddDomain={addDomain}
          maxDomainsReached={domainCart.size >= maxDomains}
        />
        <DomainList domains={domainCart.toArray()} onRemove={removeDomain} />

        <Box p={4} borderWidth={1} borderRadius="md" mt={4}>
          <Text fontWeight="bold" mb={2} color="fiber_purple">
            Checkout Requirements
          </Text>
          <Text>
            You need to add exactly <strong>{numDomainsRequired}</strong>{" "}
            domains to proceed to checkout.
          </Text>
          <Text mt={2}>
            Your Cart: <strong>{domainCart.size}</strong> /{" "}
            <strong>{numDomainsRequired}</strong> domains required
          </Text>
          {domainCart.size > numDomainsRequired && (
            <Text color="red.600" mt={2}>
              You have too many domains in your cart. Please remove{" "}
              <strong>{domainCart.size - numDomainsRequired}</strong> domain
              name(s) to checkout.
            </Text>
          )}
          <CartActions
            domainCart={domainCart}
            setDomainCart={setDomainCart}
            numDomainsRequired={numDomainsRequired}
            onCopyToClipboard={onCopy}
            canPurchase={canPurchase}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default DomainChallenge;
