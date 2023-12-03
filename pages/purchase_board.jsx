import { useState } from "react";
import clientPromise from "../lib/mongodb";
//,board_thickness,board_grade,plain_board_stock,papers_list,paper_roll_stock

export default function PurchaseBoard({
  board_category,
  board_thickness,
  board_grade,
}) {
  const today = new Date();

  // Get the individual components of the date (year, month, day)
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Months are zero-based, so add 1
  const day = today.getDate();

  // Format the date as a string (YYYY-MM-DD)
  const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;

  const [formData, setFormData] = useState({
    date: formattedDate,
    bill: "",
    category: "",
    thickness: "",
    grade: "",
    quantity: "",
    paper: "PLAIN",
    type: "",
    remark: "PURCHASE",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    // Submit form data to serverless function
    const response = await fetch("/api/submitBoardInventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Data saved successfully");
      // Optionally, you can navigate to a success page or display a success message
    } else {
      alert("Data save failed");
    }
    setFormData({
      date: formattedDate,
      bill: "",
      category: "",
      thickness: "",
      grade: "",
      quantity: "",
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1>Add purchase of Plain Board</h1>

      <h3> Enter Purchase Date:</h3>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <h3> Enter Bill Number:</h3>
      <input
        type="number"
        name="bill"
        value={formData.bill}
        onChange={handleChange}
        placeholder="Bill Number"
        required
      />

      <h3> Select Board Category:</h3>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        required
      >
        <option value="" disabled selected hidden>
          Category
        </option>
        {board_category.map((category) => (
          <option key={category._id} value={category.Category}>
            {category.Category}
          </option>
        ))}
      </select>

      <h3> Select Board Thickness:</h3>
      <select
        name="thickness"
        value={formData.thickness}
        onChange={handleChange}
        placeholder="Thickness"
        required
      >
        <option value="" disabled selected hidden>
          Thickness
        </option>
        {board_thickness.map((thickness) => (
          <option key={thickness._id} value={thickness.Thickness}>
            {thickness.Thickness}
          </option>
        ))}
      </select>

      <h3> Select Board Grade:</h3>
      <select
        name="grade"
        value={formData.grade}
        onChange={handleChange}
        placeholder="Grade"
        required
      >
        <option value="" disabled selected hidden>
          Grade
        </option>
        {board_grade.map((grade) => (
          <option key={grade._id} value={grade.Grade}>
            {grade.Grade}
          </option>
        ))}
      </select>

      <h3> Enter Purchase Quantity:</h3>
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        required
      />
      <br />
      <br />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("cpl_stock");

    const board_category = await db
      .collection("board_category")
      .find({})
      .toArray();

    const board_thickness = await db
      .collection("board_thickness")
      .find({})
      .sort({ Thickness: 1 })
      .toArray();

    const board_grade = await db.collection("board_grade").find({}).toArray();

    return {
      props: {
        board_category: JSON.parse(JSON.stringify(board_category)),
        board_thickness: JSON.parse(JSON.stringify(board_thickness)),
        board_grade: JSON.parse(JSON.stringify(board_grade)),
      },
    };
  } catch (e) {
    console.error(e);
  }
}
