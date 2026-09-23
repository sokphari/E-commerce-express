/**
 * @openapi
 * /api/v1/addresses:
 *   get:
 *     tags: [Addresses]
 *     summary: List customer addresses
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Address list }
 *   post:
 *     tags: [Addresses]
 *     summary: Create customer address
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AddressInput' }
 *     responses:
 *       201: { description: Address created }
 * /api/v1/addresses/{id}:
 *   patch:
 *     tags: [Addresses]
 *     summary: Update customer address
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AddressInput' }
 *     responses:
 *       200: { description: Address updated }
 *   delete:
 *     tags: [Addresses]
 *     summary: Delete customer address
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Address deleted }
 * /api/v1/addresses/{id}/default:
 *   patch:
 *     tags: [Addresses]
 *     summary: Set default customer address
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Default address updated }
 */

const express = require("express");
const addressController = require("../controllers/address.controller");
const { authenticate } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
  addressIdSchema,
  createAddressSchema,
  updateAddressSchema,
} = require("../validators/address.validator");

const router = express.Router();

router.use(authenticate);

router.get("/", addressController.listAddresses);
router.post("/", validate(createAddressSchema), addressController.createAddress);
router.patch("/:id", validate(updateAddressSchema), addressController.updateAddress);
router.patch("/:id/default", validate(addressIdSchema), addressController.setDefaultAddress);
router.delete("/:id", validate(addressIdSchema), addressController.deleteAddress);

module.exports = router;
