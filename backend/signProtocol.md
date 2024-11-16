# Developer Feedback on Sign Protocol

We encountered several challenges and learning opportunities while integrating **Sign Protocol**. This feedback aims to help the Sign Protocol team improve the developer experience, documentation, tools, and features. A more seamless experience will also empower developers to leverage Sign Protocol's capabilities more effectively.

---

## Feedback Summary

### 1. **Tools (API/SDK)**

- **Issue**: Lack of intuitive error messages.
  - Errors returned by the SDK often lacked meaningful context or resolution guidance.
- **Suggested Improvement**:
  - Enrich error messages with actionable insights, such as specifying the missing or incorrect field.
  - Introduce an error code reference in the documentation.

---

### 2. **Protocol Features**

- **Issue**: No built-in support for data compression.
  - Signing large payloads (e.g., `ciphertext`) frequently resulted in exceeding byte-size limitations like `bytes32`.
- **Impact**: Forced developers to implement custom solutions for compression and hashing, leading to potential errors.

---

### 3. **Additional Observations**

- **Positive Aspects**:

  - The protocol’s modular design is impressive and allows flexibility in integration.
  - The performance of the signing and verification process is excellent, even with high-volume requests.

- **Room for Improvement**:
  - Enhance the SDK by including built-in utilities for common cryptographic operations (e.g., hashing, encoding).
