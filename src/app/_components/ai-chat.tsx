// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// 'use client';

// import { useChat } from '@ai-sdk/react';
// import Markdown from 'react-markdown';

// export default function AIChat() {
//     const { messages, input, setInput, append } = useChat();

//     return (
//         <div className="flex flex-col h-[800px] w-full bg-gray-100">
//             <div className="flex-grow p-4 overflow-y-auto">
//                 {messages.map((message, index) => (
//                     <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
//                         <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white float-right' : 'bg-gray-200 text-black float-left'}`}>
//                             <Markdown>{message.content}</Markdown>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             <div className="p-4 bg-gray-200 border-t border-gray-300">
//                 <div className="flex items-center justify-center">
//                     <input
//                         className="w-full p-2 rounded-lg border-gray-300 text-black"
//                         placeholder="Type your message..."
//                         value={input}
//                         onChange={event => {
//                             setInput(event.target.value);
//                         }}
//                         onKeyDown={async event => {
//                             if (event.key === 'Enter' && input.trim()) {
//                                 await append({ content: input, role: 'user' });
//                                 setInput('');
//                             }
//                         }}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }
