import React, { useState, useEffect } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import management from "../public/management.svg";
import trash from "../public/trash.svg";
import edit from "../public/edit.svg";
import adminPhoto from "../public/Felix-Vogel-4.png";
import line from "../public/Line2.svg";
import search from "../public/search-normal.svg";
import styles from "../styles/ProductList.module.css";
import EditModal from "../components/EditModal";
import DeleteModal from "../components/DeleteModal";
import AddModal from "../components/AddModal";
import { useRouter } from "next/router";
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const adminName = "میلاد عظمی";
  const router = useRouter();

  const fetchProducts = (currentPage = 1) => {
    fetch(`http://localhost:3000/products?page=${currentPage}&limit=10`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.data || []);
        setTotalPages(data.totalPages || 0);
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedProduct) => {
    const token = Cookies.get("authToken");

    if (!token) {
      toast.error("لطفا وارد حساب کاربری شوید.");
      router("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/products/${updatedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response.ok) {
        throw new Error("محصول به روز رسانی نشد!");
      }

      const updatedProducts = products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
      setProducts(updatedProducts);
      toast.success("محصول با موفقیت به‌روزرسانی شد.");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating product:", error.message);
      toast.error("خطا در به‌روزرسانی محصول!");
    }
  };

  const handleCreateProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    toast.success("محصول با موفقیت اضافه شد.");
    setAddModalOpen(false);
  };

  const handleDeleteProduct = async (productId) => {
    const token = Cookies.get("authToken");

    if (!token) {
      toast.error("لطفا وارد حساب کاربری شوید.");
      router("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: [productId] }),
      });

      if (!response.ok) {
        throw new Error("متاسفانه محصول مورد نظر حذف نشد");
      }

      toast.success("محصول با موفقیت حذف شد.");
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      toast.error("خطا در حذف محصول!");
    }
  };

  const handleConfirmDelete = async () => {
    if (currentProduct) {
      await handleDeleteProduct(currentProduct.id);
      setDeleteModalOpen(false);
    }
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    fetchProducts(selectedPage);
  };

  return (
    <div>
      <div className={styles.headContainer}>
        <div className={styles.adminSection}>
          <div className={styles.adminDetails}>
            <span className={styles.adminName}>{adminName}</span>
            <span className={styles.adminRole}>مدیر</span>
          </div>
          <Image src={adminPhoto} alt="Admin" className={styles.adminPhoto} />
        </div>
        <Image src={line} alt="divider" style={{ marginLeft: "16px" }} />
        <div className={styles.searchBar}>
          <Image src={search} alt="search icon" />
          <input
            type="text"
            placeholder="جستجوی کالا"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.managementSection}>
        <div>
          <span className={styles.managementTitle}>مدیریت کالا</span>
          <Image
            className={styles.managementIcon}
            src={management}
            alt="Management"
          />
        </div>
        <button
          className={styles.addProduct}
          onClick={() => setAddModalOpen(true)}
        >
          افزودن محصول
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>نام کالا</th>
              <th>موجودی</th>
              <th>قیمت</th>
              <th>شناسه کالا</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  <td>{product.id}</td>
                  <td>
                    <button
                      className={styles.tableButton}
                      onClick={() => handleEdit(product)}
                    >
                      <Image src={edit} alt="Edit" />
                    </button>
                    <button
                      className={styles.tableButton}
                      onClick={() => {
                        setCurrentProduct(product);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Image src={trash} alt="Delete" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        className={styles.pagination}
        pageCount={totalPages}
        marginPagesDisplayed={0}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={styles.paginationContainer}
        pageLinkClassName={styles.pageLink}
        activeClassName={styles.activePage}
        previousLabel={null}
        nextLabel={null}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={
          currentProduct || { name: "", quantity: 0, price: 0, id: "" }
        }
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        productId={currentProduct?.id}
      />
      <ToastContainer />
      {isAddModalOpen && (
        <AddModal
          onCancel={() => setAddModalOpen(false)}
          onCreate={handleCreateProduct}
          onClose={() => setAddModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductList;
