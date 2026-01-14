const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * INVENTORY CREATED
 */
exports.onInventoryCreate = functions.firestore
    .document("inventories/{inventoryId}")
    .onCreate(async (snap) => {
      const data = snap.data();

      await admin.firestore().collection("notifications").add({
        title: "New inventory item added",
        message: `${data.itemName} (${data.quantity} ${data.unit}) was added.`,
        type: "add",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

/**
 * INVENTORY UPDATED
 */
exports.onInventoryUpdate = functions.firestore
    .document("inventories/{inventoryId}")
    .onUpdate(async (change) => {
      const after = change.after.data();

      await admin.firestore().collection("notifications").add({
        title: "Inventory item updated",
        message: `${after.itemName} was updated.`,
        type: "edit",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

/**
 * INVENTORY DELETED
 */
exports.onInventoryDelete = functions.firestore
    .document("inventories/{inventoryId}")
    .onDelete(async (snap) => {
      const data = snap.data();

      await admin.firestore().collection("notifications").add({
        title: "Inventory item removed",
        message: `${data.itemName} was removed.`,
        type: "delete",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
