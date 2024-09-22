import DomainChallenge from "./DomainChallenge";

export interface ChallengeProps {
  /**
   * The maximum number of domains the user is allowed to have
   * in their cart. Invalid domains count toward this limit as well.
   */
  maxDomains: number;
}

export function Challenge(props: ChallengeProps) {
  const maxDomains = props.maxDomains;
  const numDomainsRequired = 5; // Hardcoded for now

  return (
    <DomainChallenge
      maxDomains={maxDomains}
      numDomainsRequired={numDomainsRequired}
    />
  );
}
