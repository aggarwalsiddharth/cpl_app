import { useState } from "react";
import { useRouter } from "next/router";
import clientPromise from "../lib/mongodb";
//,board_thickness,board_grade,plain_board_stock,papers_list,paper_roll_stock

export default function Sale({
  paper_list,
  board_category,
  board_thickness,
  board_grade,
}) {
  const router = useRouter();
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
    paper: "",
    type: "",
    remark: "SALE",
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
      router.push("/sale_inventory");
      // alert("Data saved successfully");
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
      paper: "",
      type: "",
      quantity: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add Sale</h1>
      <h3> Enter Sale Date:</h3>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <h3> Enter Party Name:</h3>
      <input
        type="text"
        name="bill"
        value={formData.bill}
        onChange={handleChange}
        placeholder="Party Name"
        required
      />
      <h3> Select Paper:</h3>
      <select
        name="paper"
        value={formData.paper}
        onChange={handleChange}
        required
      >
        <option value="" disabled defaultValue hidden>
          Paper
        </option>
        {paper_list.map((paper) => (
          <option key={paper._id} value={paper.Paper}>
            {paper.Paper}
          </option>
        ))}
      </select>

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

      <h3> Select Sale Type:</h3>
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        placeholder="Type"
        required
      >
        <option value="" disabled selected hidden>
          Type
        </option>

        <option key="OSR" value="OSR">
          OSR
        </option>
        <option key="OSL" value="OSL">
          OSL
        </option>
        <option key="BSL" value="BSL">
          BSL
        </option>
      </select>
      <p>Available Amount after Production: {120} boards</p>
      <h3> Enter Sale Quantity (in pcs):</h3>
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

    const paper_list = await db.collection("paper_list").find({}).toArray();
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
        paper_list: JSON.parse(JSON.stringify(paper_list)),
        board_category: JSON.parse(JSON.stringify(board_category)),
        board_thickness: JSON.parse(JSON.stringify(board_thickness)),
        board_grade: JSON.parse(JSON.stringify(board_grade)),
      },
    };
  } catch (e) {
    console.error(e);
  }
}
