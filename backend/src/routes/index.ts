import express from "express";
import { encryptAndGenerateAttestation } from "../controller/encryptAndGenerateAttestation";
import { dycriptAndGetAttestation } from "../controller/dycriptAndGetAttestation";

const router = express.Router();

router.post("/encrypt", encryptAndGenerateAttestation);
router.post("/dycript", dycriptAndGetAttestation);

export default router;
