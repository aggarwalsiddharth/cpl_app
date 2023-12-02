import clientPromise from "../lib/mongodb";
//,board_thickness,board_grade,plain_board_stock,papers_list,paper_roll_stock

export default function ProductionPrelam({
  paper_list,
  board_category,
  board_thickness,
  board_grade,
}) {
  return (
    <form>
      <h1>Add Pre-Lam Production</h1>
      <h3> Enter Production Date:</h3>
      <input type="date" />
      <h3> Enter Party Name:</h3>
      <input type="text" />
      <h3> Select Paper:</h3>
      <select>
        {paper_list.map((paper) => (
          <option key={paper._id} value={paper.Paper}>
            {paper.Paper}
          </option>
        ))}
      </select>
      <p>
        Available Amount before Production: <b>{145} kg </b> Roll &{" "}
        <b>{120} sheets</b> in AC Room
      </p>
      <h3> Select Board Category:</h3>
      <select>
        {board_category.map((category) => (
          <option key={category._id} value={category.Category}>
            {category.Category}
          </option>
        ))}
      </select>
      <h3> Select Board Thickness:</h3>
      <select>
        {board_thickness.map((thickness) => (
          <option key={thickness._id} value={thickness.Thickness}>
            {thickness.Thickness}
          </option>
        ))}
      </select>
      <h3> Select Board Grade:</h3>
      <select>
        {board_grade.map((grade) => (
          <option key={grade._id} value={grade.Grade}>
            {grade.Grade}
          </option>
        ))}
      </select>
      <p>Available Amount before Production: {120} boards</p>
      <h3> Number of boards made (in pcs):</h3>
      <input label="OSR" type="number" placeholder="OSR" />
      <br />
      <input label="OSL" type="number" placeholder="OSL" />
      <br />
      <input label="BSL" type="number" placeholder="BSB" />
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
