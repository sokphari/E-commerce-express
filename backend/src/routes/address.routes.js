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
