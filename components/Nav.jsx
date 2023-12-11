import Link from "next/link";

const Nav = () => {
  return (
    <>
      <button>
        <Link href="/">CPL Stock</Link>
      </button>
      <button>
        <Link href="/board_inventory">Board Inventory</Link>
      </button>
      <button>
        <Link href="/purchase_paper">Purchase Paper</Link>
      </button>
      <button>
        <Link href="/production_inventory">Production Inventory</Link>
      </button>
      <button>
        <Link href="/production_board">Production Paper</Link>
      </button>
      <button>
        <Link href="/sale_inventory">Sale</Link>
      </button>
      <button>
        <Link href="/stock_board">Stock Board</Link>
      </button>
      <button>
        <Link href="/stock_paper">Stock Paper</Link>
      </button>
    </>
  );
};

export default Nav;
