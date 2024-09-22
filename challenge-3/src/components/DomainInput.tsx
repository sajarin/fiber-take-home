import React, { useState, useEffect } from "react";
import { HStack, Input, Button, Tooltip, Spinner, Box } from "@chakra-ui/react";
import { Domain, isDomainAvailable } from "../lib/resources";

interface DomainInputProps {
  onAddDomain: (domain: Domain) => void;
  maxDomainsReached: boolean;
}

/**
 * DomainInput component allows users to input and validate domain names,
 * and add them to the domain cart upon validation and availability check.
 *
 * @param onAddDomain - Function to add a validated domain to the cart.
 * @param maxDomainsReached - Boolean indicating if the maximum number of domains has been reached.
 */
const DomainInput: React.FC<DomainInputProps> = ({
  onAddDomain,
  maxDomainsReached,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  /**
   * Validates the domain name based on predefined rules.
   *
   * @param domain - The domain name to validate.
   * @returns {boolean} - Returns true if the domain is valid, otherwise false.
   */
  const validateDomain = (domain: string): boolean => {
    if (/^https?:\/\//.test(domain)) {
      setValidationError(
        "Domain name should not start with 'http://' or 'https://'"
      );
      return false;
    }
    if (!/^[a-zA-Z0-9-]+\.(com|xyz|app)$/i.test(domain)) {
      setValidationError("Domain name must end with '.com', '.xyz', or '.app'");
      return false;
    }
    setValidationError("");
    return true;
  };

  /**
   * Handles input changes and validates the domain name in real-time.
   *
   * @param event - React ChangeEvent for the input field.
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputValue(value);
    setIsValid(validateDomain(value.trim().toLowerCase()));
  };

  /**
   * Handles adding the domain by validating it and checking its availability.
   */
  const handleAddDomain = async () => {
    const domainName = inputValue.trim().toLowerCase();
    if (validateDomain(domainName)) {
      setIsLoading(true);
      const isAvailable = await isDomainAvailable(domainName);
      setIsLoading(false);
      onAddDomain({ name: domainName, isAvailable });
      setInputValue("");
    }
  };

  // Re-validate the domain name whenever the input value changes
  useEffect(() => {
    if (inputValue) {
      validateDomain(inputValue.trim().toLowerCase());
    }
  }, [inputValue]);

  return (
    <HStack mb={4} align="stretch">
      <Tooltip label={validationError} isOpen={!isValid} bg="red.600">
        <Box flex={1}>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && handleAddDomain()}
            placeholder="Enter domain name"
            borderColor={!isValid ? "red.600" : "gray.300"}
          />
        </Box>
      </Tooltip>
      <Button
        onClick={handleAddDomain}
        disabled={maxDomainsReached || isLoading || !isValid}
        bg="fiber_purple"
        color="white"
        _hover={{ bg: "fiber_purple", opacity: 0.8 }}
        _disabled={{ opacity: 0.6 }}
      >
        {isLoading ? <Spinner size="sm" /> : "Add"}
      </Button>
    </HStack>
  );
};

export default DomainInput;
