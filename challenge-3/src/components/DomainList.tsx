import React from "react";
import { VStack } from "@chakra-ui/react";
import DomainItem from "./DomainItem";

interface DomainListProps {
  domains: Array<{ name: string; isAvailable: boolean | null }>;
  onRemove: (domainToRemove: string) => void;
}

/**
 * DomainList component to display a list of DomainItem components.
 *
 * @param {Array<{ name: string, isAvailable: boolean | null }>} domains - An array of domains with their availability status.
 * @param {function} onRemove - Function to remove a domain from the list.
 */
const DomainList: React.FC<DomainListProps> = ({ domains, onRemove }) => {
  /**
   * Handles the removal of a domain from the list.
   *
   * @param domainToRemove - The name of the domain to remove.
   */
  const handleRemoveDomain = (domainToRemove: string) => {
    onRemove(domainToRemove);
  };

  return (
    <VStack spacing={2}>
      {domains.map((domain, index) => (
        <DomainItem
          key={index}
          name={domain.name}
          isAvailable={domain.isAvailable}
          onRemove={() => handleRemoveDomain(domain.name)}
        />
      ))}
    </VStack>
  );
};

export default DomainList;
