import React from "react";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Link from "next/link";
import Union from "../public/Union.svg";
import styles from "../styles/Singup.module.css";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";

const Signup = () => {
  const router = useRouter();
  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("نام کاربری الزامی است"),
    password: Yup.string()
      .min(4, "رمز عبور باید حداقل ۴ کاراکتر باشد")
      .required("رمز عبور الزامی است"),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "رمز عبور باید با تکرار رمز عبور مشابه باشد"
      )
      .required("تکرار رمز عبور الزامی است"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`;

      const response = await axios.post(apiUrl, values, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      console.log("Signup successful:", response.data);
      toast.error("حساب کاربری با موفقیت ساخته شد");
      router.push("/login");
    } catch (error) {
      console.error("Error signing up:", error.response?.data || error.message);
      setErrors({
        apiError:
          error.response?.data?.message || "متاسفانه حساب کاربری ساخته نشد",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className={styles.title}>بوت کمپ بوتواستارت</h1>
      <div className={styles.container}>
        <Image src={Union} alt="logo" />
        <h1 className={styles.title}>فرم ثبت نام</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <div>
                <label>
                  <Field type="text" name="username" placeholder="نام کاربری" />
                </label>
                <ErrorMessage
                  name="username"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>
              <div>
                <label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="رمز عبور"
                  />
                </label>
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>
              <div>
                <label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="تکرار رمز عبور"
                  />
                </label>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className={styles.errorMessage}
                />
              </div>
              {errors.apiError && (
                <div className="error">{errors.apiError}</div>
              )}
              <button type="submit" disabled={isSubmitting}>
                ثبت نام
              </button>
            </Form>
          )}
        </Formik>
        <Link href="/login">حساب کاربری دارید؟</Link>
      </div>
    </>
  );
};

export default Signup;
