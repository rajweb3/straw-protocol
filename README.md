# straw-protocol

### Enabling Seamless Cross-Chain Service Invocation with ERC-7683

##### Straw Protocol is a protocol that enables seamless cross-chain service invocation using ERC-7683. It unifies fragmented blockchain ecosystems by allowing smart contracts on one chain to securely interact with services on other chains. By addressing solver fragmentation and standardizing service invocation, it delivers a unified and interoperable network for decentralized applications.

---

### Architecture of STRAW
![straw_arch_f](https://github.com/user-attachments/assets/2e6d991d-a8c9-49d1-a72b-440b2bc398a3)

#### Technologies Used

1. **ERC-7683**:
   - Core protocol for service invocation and settlement.
2. **Scroll L1SLOAD**:
   - Reads state storage slots on L1 for secure validation of service invocations.
3. **Lit Protocol**:
   - Implements encryption for secure data sharing using **LitJsSdk**.
4. **Sign Protocol**:
   - Trustless attestations for validating user actions and maintaining data integrity.
5. **ENS Integration**:
   - Demonstrates service invocation through a user-friendly Ethereum Name Service interface.


