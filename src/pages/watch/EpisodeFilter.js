import React from 'react';

const sharedClasses = {
    bgZinc700: 'bg-zinc-700',
    bgZinc800: 'bg-zinc-800',
    textWhite: 'text-white',
    roundedLG: 'rounded-lg',
    p2: 'p-2',
    flex: 'flex',
    itemsCenter: 'items-center',
    spaceX2: 'space-x-2',
    relative: 'relative',
    wFull: 'w-full',
    pl10: 'pl-10',
    absolute: 'absolute',
    left3: 'left-3',
    topHalf: 'top-1/2',
    transform: 'transform',
    translateYHalf: '-translate-y-1/2',
    grid: 'grid',
    gridCols5: 'grid-cols-5',
    gap2: 'gap-2',
    ariaHidden: 'aria-hidden',
};

const EpisodeFilter = ({ episodeRanges, episodes, setEpisodesInRange, selectedRangeIndex, setSelectedRangeIndex }) => {
    return (
        <div className={`${sharedClasses.bgZinc800} ${sharedClasses.textWhite} ${sharedClasses.roundedLG} ${sharedClasses.spaceY4} p-4`}>
            <div className={`${sharedClasses.flex} ${sharedClasses.itemsCenter} ${sharedClasses.spaceX2}`}>
                <select
                    className={`${sharedClasses.bgZinc700} ${sharedClasses.textWhite} ${sharedClasses.p2} ${sharedClasses.roundedLG}`}
                    onChange={(e) => {
                        const index = parseInt(e.target.value);
                        const range = episodeRanges[index];
                        setEpisodesInRange(episodes.slice(range.start - 1, range.end));
                        setSelectedRangeIndex(index);
                    }}
                    value={selectedRangeIndex}
                >
                    {episodeRanges.map((range, index) => (
                        <option key={index} value={index}>
                            Episodes {range.start} - {range.end}
                        </option>
                    ))}
                </select>
                <div className={`${sharedClasses.relative} ${sharedClasses.flex1}`}>
                    <input
                        type="text"
                        placeholder="Filter episodes..."
                        className={`${sharedClasses.wFull} ${sharedClasses.bgZinc700} ${sharedClasses.textWhite} ${sharedClasses.p2} ${sharedClasses.roundedLG} ${sharedClasses.pl10}`}
                    />
                    <svg
                        className={`${sharedClasses.absolute} ${sharedClasses.left3} ${sharedClasses.topHalf} ${sharedClasses.transform} ${sharedClasses.translateYHalf} ${sharedClasses.textZinc400}`}
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <button className={`${sharedClasses.bgZinc700} ${sharedClasses.p2} ${sharedClasses.roundedLG}`}>
                    <img className={sharedClasses.ariaHidden} alt="grid" src="https://placehold.co/20x20" />
                </button>
            </div>
            <div className={`${sharedClasses.grid} ${sharedClasses.gridCols5} ${sharedClasses.gap2}`}>
                {[...Array(11).keys()].map((index) => (
                    <button key={index} className={`${sharedClasses.bgZinc700} ${sharedClasses.p2} ${sharedClasses.roundedLG}`}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EpisodeFilter;
