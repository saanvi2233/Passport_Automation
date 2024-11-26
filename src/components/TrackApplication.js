// // src/components/TrackApplication.js
// import { useState } from 'react';

// const TrackApplication = () => {
//   const [applicationId, setApplicationId] = useState('');
//   const [status, setStatus] = useState(null);

//   const handleTrack = async (e) => {
//     e.preventDefault();
//     try {
//       // Make API call to check application status
//       // Update status state with response
//       setStatus('Processing'); // Example status
//     } catch (error) {
//       console.error('Error tracking application:', error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2>Track Your Application</h2>
//       <form onSubmit={handleTrack}>
//         <div>
//           <label htmlFor="applicationId">Application ID</label>
//           <input
//             type="text"
//             id="applicationId"
//             value={applicationId}
//             onChange={(e) => setApplicationId(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           Track
//         </button>
//       </form>
//       {status && (
//         <div className="mt-4">
//           <h3>Application Status:</h3>
//           <p>{status}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TrackApplication;
