import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Api from '../service/Api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const statesList = [
  'Andaman & Nicobar Islands', 'Andhra Pradesh (Old)', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra & Nagar Haveli', 'Daman & Diu', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Telangana', 'Andhra Pradesh', 'Ladakh'
];

const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string().required('Phone number is required'),
  state: Yup.string().required('State is required'),
});

const PopupModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [initialValues, setInitialValues] = useState({
    phoneNumber: '',
    state: ''
  });

  const { isSignedIn, user: clerkUser, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const fetchUserDetails = async () => {
      try {
        const res = await Api.get(`/auth/getUserDetails/${clerkUser.id}`);
        const data = res.data;
        setInitialValues({
          phoneNumber: data.phoneNumber || '',
          state: data.state || ''
        });
        setShowModal(true);
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };
    fetchUserDetails();
  }, [isLoaded, isSignedIn, clerkUser]);

  const handleSubmit = async (values) => {
    try {
      await Api.put(`/auth/update-user/${clerkUser.id}`, {
        ...values,
        userId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress
      });
      setShowModal(false);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  return (
    <>
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {() => (
                    <Form className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Phone Number</label>
                        <Field
                          type="text"
                          name="phoneNumber"
                          className="form-control"
                        />
                        <ErrorMessage name="phoneNumber" component="div" className="text-danger" />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">State</label>
                        <Field as="select" name="state" className="form-select">
                          <option value="">Select State</option>
                          {statesList.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="state" component="div" className="text-danger" />
                      </div>

                      <div className="modal-footer mt-4">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save Changes
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default PopupModal;
