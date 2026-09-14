import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { motion } from 'motion/react';

export function AddMemberModal({ onClose }: { onClose: () => void }) {
  const { addMember } = useAudio();
  const [name, setName] = useState("");
  const [role, setRole] = useState("Committee Member");
  const [phone, setPhone] = useState("+91 ");
  const [access, setAccess] = useState("Audio & Schedule");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "MB";
    
    addMember({
      id: Date.now(),
      name,
      role,
      phone,
      access,
      avatar: initials
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4 text-emerald-50">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-[#051c13] w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-amber-100">Add Committee Operator</h3>
          <button onClick={onClose} className="p-1 rounded-full text-emerald-300/50 hover:text-amber-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-amber-200 block mb-1">Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Amit Patil" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#08291b] border border-amber-500/20 text-amber-100 placeholder-emerald-300/40 text-sm focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-amber-200 block mb-1">Role in Committee</label>
            <input 
              type="text" 
              placeholder="e.g. Volunteer / Sound Coordinator" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#08291b] border border-amber-500/20 text-amber-100 text-sm focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-amber-200 block mb-1">Phone Number</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#08291b] border border-amber-500/20 text-amber-100 text-sm font-mono focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-amber-200 block mb-1">Access Level</label>
            <select 
              value={access}
              onChange={(e) => setAccess(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#08291b] border border-amber-500/20 text-amber-100 text-sm focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
            >
              <option className="bg-[#051c13]">Audio & Schedule</option>
              <option className="bg-[#051c13]">Full Control (Admin)</option>
              <option className="bg-[#051c13]">Volume & Tracks Only</option>
              <option className="bg-[#051c13]">View Only</option>
            </select>
          </div>

          <div className="pt-3 flex gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-[#08291b] hover:bg-[#0a3322] text-amber-200 font-semibold border border-amber-500/20 active:scale-95 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-emerald-950 font-bold shadow-md active:scale-95 transition"
            >
              Authorize Operator
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
