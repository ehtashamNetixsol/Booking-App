import * as Yup from "yup";

export const RegisterSchema = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(2, "Username should contain at least 2 characters")
    .max(25, "Username should be less than 26 characters"),
  email: Yup.string()
    .email()
    .required("Please enter your email")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i,
      "email must be a valid email"
    ),
  // file: Yup.mixed().required("Please upload a file"),
  password: Yup.string()
    .required("Please enter your password")
    .min(6, "Password must be more than 6 characters"),
  confirmPassword: Yup.string()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    })
    .required("Please confirm your password"),
  // role: Yup.string().required("Please select an option"),
});

export const LoginSchema = Yup.object({
  // username: Yup.string()
  //   .required("Username is required")
  //   .min(2, "Username should contain at least 2 characters")
  //   .max(25, "Username should be less than 26 characters"),
  email: Yup.string()
    .email()
    .required("Please enter your email")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i,
      "email must be a valid email"
    ),
  password: Yup.string()
    .required("Please enter your password")
    .min(6, "Password must be more than 6 characters"),
});

export const NewBlog = Yup.object({
  title: Yup.string()
    .required("Event title is required")
    .min(5, "Please enter at least 5 characters")
    .max(100, "Maximum character limit is 100"),
  // description: Yup.string()
  //   .required("Event description is required")
  //   .min(10, "Please enter at least 10 characters")
  //   .max(1000, "Maximum character limit is 1000"),
  date: Yup.date().nullable().required("Event date is required"),
  time: Yup.string().required("Event time is required"),
  location: Yup.string().required("Event location is required"),
});

// selectedCategory: Yup.string().required("Category is required"),
