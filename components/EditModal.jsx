import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "../styles/EditModal.module.css";

const EditModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  productId,
  authToken,
}) => {
  if (!isOpen) return null;

  const validationSchema = Yup.object({
    name: Yup.string().required("نام الزامی است"),
    quantity: Yup.number()
      .required("تعداد الزامی است")
      .min(1, "تعداد باید بزرگ‌تر از صفر باشد"),
    price: Yup.number()
      .required("قیمت الزامی است")
      .min(0, "قیمت نمی‌تواند منفی باشد"),
  });

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = (values, { setSubmitting }) => {
    const updatedData = { ...values, productId, authToken };
    onSave(updatedData);
    setSubmitting(false);
  };

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={handleBackdropClick}
        role="dialog"
        aria-labelledby="edit-modal-title"
        aria-modal="true"
      ></div>
      <div className={styles.modal}>
        <h2 id="edit-modal-title">ویرایش اطلاعات</h2>
        <Formik
          initialValues={{
            name: initialData.name || "",
            quantity: initialData.quantity || "",
            price: initialData.price || "",
            id: initialData.id || "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) =>
            handleSave(values, { setSubmitting })
          }
        >
          {({ isSubmitting }) => (
            <Form>
              <div className={styles.formGroup}>
                <label>نام کالا:</label>
                <Field type="text" name="name" />

                <ErrorMessage
                  name="name"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>

              <div className={styles.formGroup}>
                <label>تعداد موجودی:</label>
                <Field type="number" name="quantity" />

                <ErrorMessage
                  name="quantity"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>

              <div className={styles.formGroup}>
                <label>قیمت:</label>
                <Field type="number" name="price" />
                <ErrorMessage
                  name="price"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>

              <div className={styles.modalButtons}>
                <button type="button" onClick={onClose} disabled={isSubmitting}>
                  انصراف
                </button>
                <button type="submit" disabled={isSubmitting}>
                  ثبت اطلاعات جدید
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default EditModal;
