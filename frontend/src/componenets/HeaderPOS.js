function HeaderPOS() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">🧾 Ultimate Inventory with POS</h1>
      <nav className="space-x-4">
        <a href="/admin" className="hover:underline">Admin</a>
        <a href="/pos" className="hover:underline font-semibold">Dashboard</a>
      </nav>
    </header>
  );
}

export default HeaderPOS;
