/**
 * Functions and tools that we've provided to you to help you
 * with the challenge.
 */

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * A mock function to "check" if the given domain is available for purchase.
 * The answers here are just dummy values -- we're not actually checking
 * if the domain can be bought -- but treat it as if they are correct for
 * the purposes of this challenge.
 * Please don't modify this function.
 * @param domain Some domain name, like "example.com". Don't include any
 *  "www", "http", subdomains, etc.
 * @returns `true` iff the domain is "available" for purchase. Note that this
 *  function uses a mock API call; treat its answers as correct for the
 *  purposes of this challenge.
 */
export async function isDomainAvailable(domain: string): Promise<boolean> {
  // NOTE: in a real setting we'd call some domain availability API,
  // but for this challenge we'll do some mock logic to simulate an API call.
  await sleep(1000);
  return domain.toLowerCase().charCodeAt(0) % 2 === 0;
}

/**
 * Interface representing a Domain.
 */
export interface Domain {
  /**
   * The name of the domain.
   */
  name: string;

  /**
   * Indicates the availability of the domain.
   * Can be true, false, or null if not checked.
   */
  isAvailable: boolean | null;
}

import { useToast } from "@chakra-ui/react";

/**
 * Function to display a toast notification.
 *
 * @param toast - The toast function returned by useToast.
 * @param title - The title to be displayed in the toast notification.
 * @param status - The status type of the toast. Can be "success", "info", "warning", or "error".
 */
export const showToast = (
  toast: ReturnType<typeof useToast>,
  title: string,
  status: "success" | "info" | "warning" | "error"
) => {
  toast({
    title,
    status,
    duration: 3000, // Set the duration for the toast (3 seconds)
    isClosable: true, // Make the toast closable by the user
  });
};
