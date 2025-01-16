import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import styles from "../styles/AddModal.module.css";
import Cookies from "js-cookie";
const AddModal = ({ onCancel, onCreate, onClose }) => {
  const initialValues = {
    name: "",
    quantity: "",
    price: "",
  };
  const router = useRouter();
  const validationSchema = Yup.object({
    name: Yup.string().required("نام الزامی است"),
    quantity: Yup.number()
      .required("تعداد الزامی است")
      .positive("تعداد باید بیشتر از صفر باشد"),
    price: Yup.number()
      .required("قیمت الزامی است")
      .positive("قیمت باید بیشتر از صفر باشد"),
  });

  const handleSubmit = async (values) => {
    const token = Cookies.get("authToken");

    if (!token) {
      alert("لطفا وارد حساب کاربری شوید.");
      router("/login");

      return;
    }

    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const newProduct = await response.json();
      onCreate(newProduct);

      onCancel();
    } catch (error) {
      alert("خطا در ایجاد محصول!");
    }
  };

  return (
    <>
      <div className={styles.modalBackdrop} onClick={onClose}></div>
      <div className={styles.modal}>
        <h2>ایجاد محصول جدید</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div>
                <label>نام کالا</label>
                <Field type="text" name="name" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <div>
                <label>تعداد موجودی</label>
                <Field type="number" name="quantity" />
                <ErrorMessage
                  name="quantity"
                  component="div"
                  className="error"
                />
              </div>
              <div>
                <label>قیمت</label>
                <Field type="number" name="price" />
                <ErrorMessage name="price" component="div" className="error" />
              </div>
              <div className={styles.modalButtons}>
                <button type="button" onClick={onCancel}>
                  انصراف
                </button>
                <button type="submit">ایجاد</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddModal;
