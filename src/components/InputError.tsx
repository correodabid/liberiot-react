import React from "react";
import { ErrorMessage } from "formik";

export const InputError = ({ title }: { title: string }) => (
    <ErrorMessage name={title} render={(msg: string) => (
        <div style={{ color: 'red', lineHeight: '20px', textAlign: 'left' }}>
            {msg}
        </div>
    )} />
)