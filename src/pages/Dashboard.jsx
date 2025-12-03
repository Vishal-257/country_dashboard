import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../auth/Auth";
import Country from "../components/Country";
import { LogOut, Search, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import axios from "axios";

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name.common",
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,languages,currencies,maps,coatOfArms,subregion"
        );
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    console.log(data);
  }, []);

  const processedData = useMemo(() => {
    let filtered = data.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const getValue = (obj, path) =>
          path.split(".").reduce((o, i) => (o ? o[i] : null), obj);

        const aValue = getValue(a, sortConfig.key);
        const bValue = getValue(b, sortConfig.key);

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [data, search, sortConfig]);

  const totalPages = Math.ceil(processedData.length / rowsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen fade-in bg-gray-50 p-8">

      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Global Data Dashboard
          </h1>
          <p className="text-gray-500">Welcome back, {user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center pop-in gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition shadow-sm"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Coutry"
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm transition"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "Flag",
                  "Name",
                  "Region",
                  "Capital",
                  "Population",
                  "Currencies",
                  "Languages",
                  "Action",
                ].map((head, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => {
                      if (head === "Name") handleSort("name.common");
                      if (head === "Population") handleSort("population");
                      if (head === "Region") handleSort("region");
                      if (head === "Capital") handleSort("capital");
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {head}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((country) => (
                <tr
                  key={country.name.official}
                  className="hover:bg-blue-50/50 transition duration-150"
                >
                  <td className="px-6 py-4 text-2xl">
                    <div className="h-8 w-10">
                      <img src={country.flags.png} alt={country.flags.alt} />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {country.name.common}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{country.region}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {country.capital && Object.values(country.capital).length>0 ? country.capital[0] : "Nothing Available"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {country.population.toLocaleString()}
                  </td>
                  <td>
                    <div className="px-6 py-4 text-gray-600">
                      {country.currencies &&
                      Object.values(country.currencies).length > 0
                        ? Object.values(country.currencies)[0]?.name
                        : "Nothing Available"}
                    </div>
                  </td>
                  <td>
                    <div className="px-6 py-4 text-gray-600">
                        {country.languages && Object.values(country.languages).length > 0
                          ? Object.values(country.languages).join(", ")
                          : "Nothing Available"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedCountry(country)}
                      className="text-sm text-blue-600 font-semibold hover:text-blue-800 hover:underline"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No countries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing{" "}
            {Math.min(
              (currentPage - 1) * rowsPerPage + 1,
              processedData.length
            )}{" "}
            to {Math.min(currentPage * rowsPerPage, processedData.length)} of{" "}
            {processedData.length} entries
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded bg-white disabled:opacity-50 hover:bg-gray-100 text-sm font-medium"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded bg-white disabled:opacity-50 hover:bg-gray-100 text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedCountry && (
        <Country
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
