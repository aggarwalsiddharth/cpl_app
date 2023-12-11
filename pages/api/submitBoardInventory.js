import { connect } from "../../db";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      date,
      bill,
      category,
      thickness,
      grade,
      quantity,
      paper,
      type,
      remark,
    } = req.body;

    await connect();

    // Save the form data to MongoDB
    // Example: Saving to a "contacts" collection
    const Inventory = mongoose.model("board_inventory");

    const newInventory = new Inventory({
      date,
      bill,
      category,
      thickness,
      grade,
      quantity,
      paper,
      type,
      remark,
    });
    await newInventory.save();

    res.status(201).json({ message: "Data submitted successfully" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
