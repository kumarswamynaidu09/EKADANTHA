import { X, Play, Shuffle } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { motion } from 'motion/react';
import { Playlist } from '../../types';

interface PlaylistModalProps {
  playlist: Playlist;
  onClose: () => void;
}

export function PlaylistModal({ playlist, onClose }: PlaylistModalProps) {
  const { sdSongs, playPlaylist, playTrack, currentTrack, isPlaying, toggleShuffle } = useAudio();

  const playlistSongs = sdSongs.slice(0, playlist.count);

  const handlePlayAll = () => {
    playPlaylist(playlist.name);
    onClose();
  };

  const handleShuffle = () => {
    toggleShuffle();
    setTimeout(() => {
      playPlaylist(playlist.name);
      onClose();
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4 text-emerald-50">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="bg-[#051c13] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 flex flex-col max-h-[85vh]"
      >
        {/* Header Block */}
        <div className="bg-gradient-to-br from-[#08291b] to-[#04170f] p-6 relative border-b border-amber-500/20">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full bg-amber-500/15 text-amber-200 hover:bg-amber-500/30 transition border border-amber-500/30">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center text-center mt-2">
            <div className="w-16 h-16 rounded-3xl bg-amber-500 text-emerald-950 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 mb-4 font-bold">
              {playlist.icon}
            </div>
            <h3 className="font-bold text-xl text-amber-100 tracking-tight">{playlist.name}</h3>
            <p className="text-xs text-emerald-300/60 mt-1">{playlist.desc}</p>
            <div className="mt-3 flex gap-2">
              <span className="text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
                {playlist.badge}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              onClick={handlePlayAll}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-emerald-950 font-bold text-sm shadow-md active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Play All
            </button>
            <button 
              onClick={handleShuffle}
              className="flex-1 py-3 rounded-2xl bg-[#08291b] hover:bg-[#0a3322] text-amber-200 font-bold text-sm shadow-sm active:scale-95 transition border border-amber-500/20 flex items-center justify-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Shuffle
            </button>
          </div>
        </div>

        {/* List of Songs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {playlistSongs.map((song, idx) => {
            const isCurrent = currentTrack?.id === song.id;
            return (
              <div 
                key={song.id}
                onClick={() => {
                  playTrack(idx);
                  onClose();
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl transition cursor-pointer select-none border ${
                  isCurrent ? 'bg-amber-500/15 border-amber-500/30' : 'hover:bg-[#08291b] border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                  isCurrent ? 'bg-amber-500 text-emerald-950 font-bold shadow-md' : 'bg-[#08291b] text-amber-200 border border-amber-500/15'
                }`}>
                  {song.artwork}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-amber-200 font-bold' : 'text-emerald-100'}`}>
                    {song.title}
                  </h4>
                  <p className="text-xs text-emerald-300/60 truncate mt-0.5">
                    {song.artist}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-[11px] font-mono text-amber-200/50">{song.duration}</span>
                  {isCurrent && isPlaying ? (
                    <div className="flex items-end justify-center gap-0.5 h-3">
                      <div className="w-1 bg-amber-400 rounded-full eq-bar-1"></div>
                      <div className="w-1 bg-amber-400 rounded-full eq-bar-2"></div>
                      <div className="w-1 bg-amber-400 rounded-full eq-bar-3"></div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
