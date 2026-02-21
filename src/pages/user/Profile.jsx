import React, { useContext, useEffect, useState, useCallback } from 'react';
import DashBoard from './DashBoard';
import { FaEdit, FaSave, FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaMapMarkerAlt, FaCity, FaGlobe, FaMailBulk } from 'react-icons/fa';
import { useUser } from '@clerk/clerk-react';
import Api from '../../service/Api';
import { UserContext } from "../../context/UserProvider";

const Field = ({ icon: Icon, label, name, value, type = "text", disabled, onChange, max }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
    <div className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 transition ${disabled ? 'bg-gray-50 border-gray-200' : 'bg-white border-indigo-300 ring-1 ring-indigo-200'
      }`}>
      <Icon className={`flex-shrink-0 text-sm ${disabled ? 'text-gray-400' : 'text-indigo-500'}`} />
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        max={max}
        placeholder={`Enter ${label}`}
        className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
      />
    </div>
  </div>
);

const Profile = () => {
  const { user, utcNow } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '',
    dateOfBirth: '', address: '', country: '', state: '', city: '', postalCode: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const { isSignedIn, user: clerkUser, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const fetchUserDetails = async () => {
      try {
        const clerkId = clerkUser.id;
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const res = await Api.get(`/auth/getUserDetails/${clerkId}/${email}`);
        setUserDetails(res.data);
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };
    fetchUserDetails();
  }, [isLoaded, isSignedIn, clerkUser]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleEditClick = async () => {
    if (isEditing) {
      setSaving(true);
      try {
        await Api.put(`/auth/update-user/${clerkUser.id}`, {
          email: userDetails.email,
          userId: clerkUser.id,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          phoneNumber: userDetails.phoneNumber,
          dateOfBirth: userDetails.dateOfBirth,
          address: userDetails.address,
          country: userDetails.country,
          state: userDetails.state,
          city: userDetails.city,
          postalCode: userDetails.postalCode,
        });
        setSaveMsg('✅ Profile saved!');
        setIsEditing(false);
        setTimeout(() => setSaveMsg(''), 3000);
      } catch (err) {
        setSaveMsg('❌ Failed to save. Please try again.');
        console.error('Error updating user details:', err);
      } finally {
        setSaving(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const maxDate = utcNow ? utcNow.toISOString().split('T')[0] : '';
  const dob = userDetails.dateOfBirth
    ? new Date(userDetails.dateOfBirth).toISOString().split('T')[0]
    : '';

  return (
    <div className="flex flex-col md:flex-row">
      <DashBoard handleDrawerToggle={() => setOpen(!open)} open={open} setOpen={setOpen} />

      <div className="flex-1 bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-5xl mx-auto">

          {/* Avatar header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex items-center gap-5">
            <div className="relative">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="avatar"
                  className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100 shadow" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold shadow">
                  {userDetails.firstName?.[0] || '?'}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {userDetails.firstName} {userDetails.lastName}
              </h2>
              <p className="text-sm text-gray-500">{userDetails.email}</p>
              <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                {user?.role || 'Student'}
              </span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Personal Information</h3>
              {saveMsg && <p className="text-sm font-medium text-gray-600">{saveMsg}</p>}
              <button
                type="button"
                onClick={handleEditClick}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${isEditing
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'border border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                {saving ? (
                  <span className="animate-spin">⏳</span>
                ) : isEditing ? (
                  <><FaSave /> Save</>
                ) : (
                  <><FaEdit /> Edit</>
                )}
              </button>
            </div>

            {!userDetails.firstName && !isEditing ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field icon={FaUser} label="First Name" name="firstName" value={userDetails.firstName} disabled onChange={handleInputChange} />
                <Field icon={FaUser} label="Last Name" name="lastName" value={userDetails.lastName} disabled onChange={handleInputChange} />
                <Field icon={FaEnvelope} label="Email" name="email" value={userDetails.email} disabled onChange={handleInputChange} type="email" />
                <Field icon={FaPhone} label="Phone Number" name="phoneNumber" value={userDetails.phoneNumber} disabled={!isEditing} onChange={handleInputChange} />
                <Field icon={FaBirthdayCake} label="Date of Birth" name="dateOfBirth" value={dob} disabled={!isEditing} onChange={handleInputChange} type="date" max={maxDate} />

                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-2">Address</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Field icon={FaMapMarkerAlt} label="Address" name="address" value={userDetails.address} disabled={!isEditing} onChange={handleInputChange} />
                    </div>
                    <Field icon={FaGlobe} label="Country" name="country" value={userDetails.country} disabled={!isEditing} onChange={handleInputChange} />
                    <Field icon={FaMapMarkerAlt} label="State" name="state" value={userDetails.state} disabled={!isEditing} onChange={handleInputChange} />
                    <Field icon={FaCity} label="City" name="city" value={userDetails.city} disabled={!isEditing} onChange={handleInputChange} />
                    <Field icon={FaMailBulk} label="Postal Code" name="postalCode" value={userDetails.postalCode} disabled={!isEditing} onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
