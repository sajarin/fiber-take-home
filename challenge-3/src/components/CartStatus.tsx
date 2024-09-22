import React from "react";
import { Box, Progress, Text, HStack } from "@chakra-ui/react";

interface CartStatusProps {
  currentCount: number;
  maxCount: number;
}

/**
 * CartStatus component displays the current and maximum number of domains in the cart,
 * along with a progress bar indicating the cart status.
 *
 * @param currentCount - The current number of domains in the cart.
 * @param maxCount - The maximum number of domains allowed in the cart.
 */
const CartStatus: React.FC<CartStatusProps> = ({ currentCount, maxCount }) => {
  const isOverLimit = currentCount > maxCount;

  return (
    <Box>
      <HStack justify="space-between">
        <Text mb={1} fontWeight="bold" color="fiber_purple">
          Cart Limit
        </Text>
        <Text
          fontWeight="bold"
          color={isOverLimit ? "red.600" : "fiber_purple"}
        >
          {currentCount} / {maxCount} Domains
        </Text>
      </HStack>

      <Progress
        value={(currentCount / maxCount) * 100}
        colorScheme={isOverLimit ? "red" : "purple"}
        mb={2}
        sx={{
          "& > div": {
            backgroundColor: isOverLimit ? "red" : "fiber_purple",
          },
        }}
      />

      {isOverLimit && (
        <Text color="red.600" mt={2}>
          You have added more than the maximum number of domain names allowed.
          Please remove some to proceed.
        </Text>
      )}
    </Box>
  );
};

export default CartStatus;
