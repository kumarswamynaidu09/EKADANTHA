import React, { useState } from 'react';
import { HardDrive, RefreshCw, Search, X, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { motion, AnimatePresence } from 'motion/react';
import { PlaylistModal } from '../modals/PlaylistModal';
import { Playlist } from '../../types';

export function MusicView() {
  const { 
    sdSongs, 
    playlists, 
    currentTrackIndex, 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    prevTrack, 
    currentTime, 
    isSystemOnline, 
    playTrack,
    triggerCommand,
    playPlaylist
  } = useAudio();

  const [musicTab, setMusicTab] = useState<'songs' | 'playlists'>('songs');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const filteredSongs = sdSongs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const progressPercent = Math.min(100, (currentTime / (currentTrack?.durationSec || 1)) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-4 pb-20 text-emerald-50">
      
      {/* DEVICE LIBRARY STATUS CARD */}
      <div className="bg-[#051c13] rounded-3xl p-5 border border-amber-500/20 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-500 text-emerald-950 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0 font-bold">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-amber-100 leading-tight">
                  Device Library • SD Card
                </h2>
                <span className="text-[10px] font-mono bg-[#08291b] text-amber-200/70 px-2 py-0.5 rounded-md border border-amber-500/20">
                  FAT32 • 32GB
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs mt-1">
                <span className="font-semibold text-emerald-200">{sdSongs.length} Songs Available</span>
                <span className="text-emerald-800">•</span>
                {isSystemOnline ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    SD Card Mounted
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Device Offline
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button 
              onClick={() => triggerCommand("GET /api/device/songs", "SD Card Rescanned")}
              className="text-xs font-semibold bg-[#08291b] hover:bg-[#0a3322] text-amber-200 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1.5 transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Rescan SD</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TABS */}
      <div className="flex items-center justify-between border-b border-amber-500/15 pb-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMusicTab('songs')}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-2xl transition-all ${
              musicTab === 'songs' 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-emerald-950 shadow-md' 
                : 'bg-[#051c13] text-emerald-200/70 hover:bg-[#08291b] border border-amber-500/20'
            }`}
          >
            Available Songs ({sdSongs.length})
          </button>
          
          <button 
            onClick={() => setMusicTab('playlists')}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-2xl transition-all ${
              musicTab === 'playlists' 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-emerald-950 shadow-md' 
                : 'bg-[#051c13] text-emerald-200/70 hover:bg-[#08291b] border border-amber-500/20'
            }`}
          >
            Playlists ({playlists.length})
          </button>
        </div>
        <div className="text-[11px] text-emerald-300/40 hidden sm:block font-mono">
          DFPlayer UART protocol
        </div>
      </div>

      {/* AVAILABLE SONGS */}
      <AnimatePresence mode="wait">
        {musicTab === 'songs' && (
          <motion.div 
            key="songs"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-amber-400/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search songs on SD card..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#051c13] rounded-2xl border border-amber-500/20 text-sm text-amber-100 placeholder-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 shadow-inner transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Song List */}
            <div className="bg-[#051c13] rounded-3xl border border-amber-500/20 shadow-lg divide-y divide-amber-500/10 overflow-hidden">
              {filteredSongs.length > 0 ? (
                filteredSongs.map((song) => {
                  const originalIndex = sdSongs.findIndex(s => s.id === song.id);
                  const isCurrent = originalIndex === currentTrackIndex;

                  return (
                    <div 
                      key={song.id}
                      onClick={() => playTrack(originalIndex)}
                      className={`flex items-center gap-3.5 p-3.5 sm:p-4 transition cursor-pointer select-none ${
                        isCurrent ? 'bg-amber-500/15 border-l-4 border-l-amber-400' : 'hover:bg-[#08291b] active:bg-[#0a3322]'
                      }`}
                    >
                      <div className="w-8 text-center shrink-0">
                        {isCurrent && isPlaying ? (
                          <div className="flex items-end justify-center gap-0.5 h-4">
                            <div className="w-1 bg-amber-400 rounded-full eq-bar-1"></div>
                            <div className="w-1 bg-amber-400 rounded-full eq-bar-2"></div>
                            <div className="w-1 bg-amber-400 rounded-full eq-bar-3"></div>
                          </div>
                        ) : (
                          <span className={`text-xs font-mono font-bold ${isCurrent ? 'text-amber-300' : 'text-emerald-300/40'}`}>
                            #{String(song.id).padStart(2, '0')}
                          </span>
                        )}
                      </div>

                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                        isCurrent ? 'bg-amber-500 text-emerald-950 shadow-md font-bold' : 'bg-[#08291b] text-amber-200 border border-amber-500/15'
                      }`}>
                        {song.artwork}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-amber-200 font-bold' : 'text-emerald-100'}`}>
                            {song.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-300/60 truncate mt-0.5">
                          {song.artist} • <span className="text-amber-300/60">{song.category}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono text-amber-200/50 font-medium">
                          {song.duration}
                        </span>
                        <button 
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                            isCurrent 
                              ? 'bg-amber-500 text-emerald-950 font-bold shadow-md' 
                              : 'bg-[#08291b] text-amber-200 hover:bg-amber-500/20 border border-amber-500/15'
                          }`}
                        >
                          {isCurrent && isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                sdSongs.length === 0 ? (
                  <div className="p-10 text-center text-emerald-200/60">
                    <RefreshCw className="w-8 h-8 mx-auto text-amber-400 mb-3 animate-spin" />
                    <p className="text-sm font-semibold text-amber-200">Waiting for music library...</p>
                    <p className="text-xs text-emerald-300/40 mt-0.5">Connecting to Pico SD Card mapping feed.</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-emerald-200/60">
                    <Search className="w-8 h-8 mx-auto text-amber-400/40 mb-2" />
                    <p className="text-sm font-semibold text-amber-200">No songs found</p>
                    <p className="text-xs text-emerald-300/50">Try another search term.</p>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}

        {/* PLAYLISTS */}
        {musicTab === 'playlists' && (
          <motion.div 
            key="playlists"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
          >
            {playlists.map((pl) => (
              <div 
                key={pl.id}
                onClick={() => setSelectedPlaylist(pl)}
                className="bg-[#051c13] rounded-3xl p-5 border border-amber-500/20 shadow-lg flex flex-col justify-between hover:border-amber-500/40 transition cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-300 flex items-center justify-center text-xl shrink-0 border border-amber-500/30">
                      {pl.icon}
                    </div>
                    <span className="text-xs font-mono font-semibold bg-amber-500/15 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
                      {pl.badge}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-base text-amber-100 mt-3">{pl.name}</h3>
                  <p className="text-xs text-emerald-300/60 mt-1">{pl.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-500/15 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-300/50">Sequential loop enabled</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      playPlaylist(pl.name);
                    }}
                    className="text-xs font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-emerald-950 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md transition active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Group</span>
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPlaylist && (
          <PlaylistModal 
            playlist={selectedPlaylist} 
            onClose={() => setSelectedPlaylist(null)} 
          />
        )}
      </AnimatePresence>

      {/* PERSISTENT MINI-PLAYER */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-[88px] left-0 right-0 z-20 px-2 sm:px-0 sm:max-w-md sm:mx-auto"
          >
            <div className="bg-[#051c13]/95 backdrop-blur-md rounded-2xl border border-amber-500/30 shadow-2xl p-3 pb-2.5">
              <div className="relative h-1 w-full bg-[#08291b] rounded-full overflow-hidden mb-2 border border-amber-500/20">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-emerald-950 flex items-center justify-center text-xs shrink-0 font-bold shadow-md">
                    {currentTrack.artwork}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-amber-100 truncate">
                      {currentTrack.title}
                    </h5>
                    <p className="text-[11px] text-emerald-300/60 truncate">
                      {currentTrack.artist} • <span className="font-mono text-amber-300/70">{formatTime(currentTime)} / {currentTrack.duration}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button 
                    onClick={prevTrack}
                    className="p-2 text-emerald-300/70 hover:text-amber-200 hover:bg-[#08291b] rounded-lg transition active:scale-95"
                  >
                    <SkipBack className="w-4 h-4 fill-current" />
                  </button>

                  <button 
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-emerald-950 font-bold flex items-center justify-center shadow-md transition active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button 
                    onClick={nextTrack}
                    className="p-2 text-emerald-300/70 hover:text-amber-200 hover:bg-[#08291b] rounded-lg transition active:scale-95"
                  >
                    <SkipForward className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
