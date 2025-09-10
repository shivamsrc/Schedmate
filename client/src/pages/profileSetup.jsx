import { useState } from "react";
import TimezoneSelect from "react-timezone-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Switch } from "@headlessui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [timezone, setTimezone] = useState({});
  const [availability, setAvailability] = useState(
    Array(7).fill({ enabled: false, start: null, end: null })
  );
  const [spinner, setSpinner] = useState(null);

  const isTimezoneSelected = timezone && Object.keys(timezone).length > 0;
  const isAvailabilityValid = availability.some(
        (day) => day.enabled && day.start && day.end
    );

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

  const handleFileChange = (e) => {
    setProfilePicFile(e.target.files[0]);
    setProfilePic(URL.createObjectURL(e.target.files[0]));
  };

  const handleAvailabilityChange = (index, key, value) => {
    setAvailability((arr) =>
      arr.map((day, i) => i === index ? { ...day, [key]: value } : day)
    );
  };

  const handleSendRequest = async () => {
    try {
      setSpinner(true);
      const formData = new FormData();
      formData.append("profileImage", profilePicFile);
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("timeZone", timezone.value);

      const availabilities = days.map((val, i) => ({
        day: val,
        available: availability[i].enabled,
        startTime: availability[i].start,
        endTime: availability[i].end
      }));

      formData.append("availabilitiesData", JSON.stringify(availabilities));

      const response = await axios.post(
        "http://localhost:3000/schedmate/profile/setup",
        formData,
        { withCredentials: true }
      );

      if(response.status === 201){
        setSpinner(false);
        navigate("/user/bookings");
      }
    } catch(err){
      console.log(err)
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      <div className="relative w-full max-w-3xl bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8 z-10">

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center tracking-tight">
          Set Up Your Profile
        </h1>

        {/* Profile Pic */}
        <div className="flex items-center justify-center">
          <label className="relative cursor-pointer">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden"/>
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-gray-300/30 overflow-hidden flex items-center justify-center shadow-md hover:shadow-xl transition">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover"/>
              ) : (
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/340px-Default_pfp.svg.png"/>
              )}
            </div>
          </label>
        </div>

        {/*Name*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
            className="w-full rounded-xl border border-gray-300 px-3 sm:px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition outline-none bg-white text-gray-800 placeholder-gray-400"
          />
        </div>

        {/*Bio*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            type="text"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="describe yourself..."
            className="w-full rounded-xl border border-gray-300 px-3 sm:px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition outline-none bg-white text-gray-800 placeholder-gray-400"
          />
        </div>

        {/*Timezone*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <TimezoneSelect
            value={timezone}                        
            onChange={setTimezone}
            className="w-full rounded-xl border border-gray-300 shadow-sm bg-white text-gray-800 placeholder-gray-400"
          />
        </div>

        {/*Availability*/}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Availability</h2>
          <div className="space-y-2 sm:space-y-3">
            {days.map((day, index) => (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="w-28 font-medium text-gray-700">{day}</span>
                <Switch
                  checked={availability[index].enabled}
                  onChange={(val) => handleAvailabilityChange(index, "enabled", val)}
                  className={`${availability[index].enabled ? "bg-indigo-400" : "bg-gray-300"} relative inline-flex h-6 w-14 items-center rounded-full transition`}
                >
                  <span
                    className={`${availability[index].enabled ? "translate-x-8" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full shadow transition`}
                  />
                </Switch>
                {availability[index].enabled && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
                    <DatePicker
                      selected={availability[index].start}                
                      onChange={(date) => handleAvailabilityChange(index, "start", date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Start"
                      dateFormat="h:mm aa"
                      className="border rounded-xl px-3 py-1 shadow-sm focus:ring-1 focus:ring-indigo-400 bg-white text-gray-800 placeholder-gray-400"
                      placeholderText="Start time"
                    />
                    <DatePicker
                      selected={availability[index].end}
                      onChange={(date) => handleAvailabilityChange(index, "end", date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="End"
                      dateFormat="h:mm aa"
                      className="border rounded-xl px-3 py-1 shadow-sm focus:ring-1 focus:ring-indigo-400 bg-white text-gray-800 placeholder-gray-400"
                      placeholderText="End time"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/*Save Button*/}
        <button
          onClick={handleSendRequest}
          className={`${name && isTimezoneSelected && isAvailabilityValid ? "pointer-events-auto" : "pointer-events-none"} w-full py-3 rounded-3xl bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold shadow-md hover:brightness-110 transition transform hover:scale-105`}
        >
          Save Profile
        </button>
      </div>

      {/*Spinner*/}
      {spinner && (
        <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-t-indigo-400 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
