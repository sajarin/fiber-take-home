import { HStack, Text, Button, Badge } from "@chakra-ui/react";
import React from "react";

interface DomainItemProps {
  name: string;
  isAvailable: boolean | null;
  onRemove: () => void;
}

/**
 * DomainItem component displays information about a domain,
 * including its name, availability status, and a button to remove it from the cart.
 *
 * @param name - The domain name.
 * @param isAvailable - Availability status of the domain (`true` for available, `false` for unavailable, `null` for checking).
 * @param onRemove - Function to remove the domain from the cart.
 */
const DomainItem: React.FC<DomainItemProps> = ({
  name,
  isAvailable,
  onRemove,
}) => (
  <HStack
    spacing={4}
    p={3}
    borderWidth={1}
    borderRadius="md"
    alignItems="center"
    justifyContent="space-between"
    w="100%"
  >
    {/* Domain name and availability status */}
    <Text>
      {name} -
      {isAvailable === null ? (
        <Badge ml={2} colorScheme="yellow">
          Checking...
        </Badge>
      ) : isAvailable ? (
        <Badge ml={2} colorScheme="purple">
          Available
        </Badge>
      ) : (
        <Badge ml={2} colorScheme="red">
          Unavailable
        </Badge>
      )}
    </Text>

    {/* Remove button */}
    <Button size="sm" colorScheme="red" onClick={onRemove}>
      Remove
    </Button>
  </HStack>
);

export default DomainItem;
