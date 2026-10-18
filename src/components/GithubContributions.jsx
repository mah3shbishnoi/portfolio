import React, { useState, useEffect, useMemo, useRef } from 'react';
import './GithubContributions.css';

const USERNAME = 'mah3shbishnoi';
const CACHE_KEY = `github_contributions_${USERNAME}`;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const GithubContributions = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const hasAutoScrolled = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Check localStorage Cache first
    let hasFreshCache = false;
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data: cachedData } = JSON.parse(cached);
        if (cachedData && Array.isArray(cachedData.contributions)) {
          if (isMounted) {
            setData(cachedData);
            setLoading(false);
          }
          if (Date.now() - timestamp < CACHE_TTL) {
            hasFreshCache = true;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage error while reading GitHub contributions:', e);
    }

    // 2. If fresh cache is present, skip network fetch to protect rate-limit
    if (hasFreshCache) return;

    // 3. Fetch live data
    fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((liveData) => {
        if (isMounted && liveData && Array.isArray(liveData.contributions)) {
          setData(liveData);
          setLoading(false);
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ timestamp: Date.now(), data: liveData })
            );
          } catch (e) {
            console.warn('LocalStorage save error:', e);
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          // If we already had cached data, silently ignore error
          if (!data) {
            setError(err.message);
          }
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Process contributions into 53 weeks and calculate statistics
  const { weeks, monthLabels, totalContributions, longestStreak, currentStreak } = useMemo(() => {
    if (!data || !Array.isArray(data.contributions) || data.contributions.length === 0) {
      return { weeks: [], monthLabels: [], totalContributions: 0, longestStreak: 0, currentStreak: 0 };
    }

    const list = data.contributions;
    const total = data.total?.lastYear ?? list.reduce((acc, curr) => acc + curr.count, 0);

    // Calculate streaks
    let longest = 0;
    let tempStreak = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].count > 0) {
        tempStreak++;
        if (tempStreak > longest) longest = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    let current = 0;
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].count > 0) {
        current++;
      } else {
        if (i === list.length - 1) continue; // Today might be 0 so far
        break;
      }
    }

    // Arrange into weeks (Sunday to Saturday)
    const weeksArr = [];
    let currentWeek = [];
    const firstDate = new Date(list[0].date);
    const startDay = firstDate.getDay();

    for (let i = 0; i < startDay; i++) {
      currentWeek.push(null);
    }

    list.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksArr.push(currentWeek);
    }

    // Month headers
    const mLabels = [];
    let lastMonth = -1;
    weeksArr.forEach((week, wIdx) => {
      const validDay = week.find((d) => d !== null);
      if (validDay) {
        const d = new Date(validDay.date);
        const m = d.getMonth();
        if (m !== lastMonth) {
          mLabels.push({ weekIndex: wIdx, label: MONTHS[m] });
          lastMonth = m;
        }
      }
    });

    return {
      weeks: weeksArr,
      monthLabels: mLabels,
      totalContributions: total,
      longestStreak: longest,
      currentStreak: current
    };
  }, [data]);

  const handleMouseEnter = (e, day) => {
    if (!day) return;
    const rect = e.target.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    
    const dateObj = new Date(day.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const countText = day.count === 1 ? '1 contribution' : `${day.count} contributions`;

    setTooltip({
      visible: true,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 8,
      content: `${countText} on ${formattedDate}`
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Cell dimensions in SVG
  const SQUARE_SIZE = 11;
  const GAP = 3;
  const LEFT_PADDING = 30;
  const TOP_PADDING = 20;
  const SVG_WIDTH = weeks.length * (SQUARE_SIZE + GAP) + LEFT_PADDING + 6;
  const SVG_HEIGHT = 7 * (SQUARE_SIZE + GAP) + TOP_PADDING + 6;

  // Scroll to the latest (rightmost) part of the graph by default on mobile screens
  useEffect(() => {
    if (!stageRef.current || weeks.length === 0) return;
    const stage = stageRef.current;

    const scrollToLatest = () => {
      if (stage && stage.scrollWidth > stage.clientWidth) {
        stage.scrollLeft = stage.scrollWidth - stage.clientWidth;
        hasAutoScrolled.current = true;
      }
    };

    scrollToLatest();
    const timer = setTimeout(scrollToLatest, 60);

    const handleResize = () => {
      if (!hasAutoScrolled.current) {
        scrollToLatest();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [data, weeks.length]);

  return (
    <div className="github-heatmap-card" ref={containerRef}>
      {/* Card Header */}
      <div className="github-heatmap-header">
        <div className="github-header-left">
          <div className="github-icon-badge">
            <svg height="22" width="22" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
          </div>
          <div className="github-header-text">
            <h3 className="github-title">GitHub Contributions</h3>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="github-stats-cluster">
          <div className="stat-pill primary">
            <span className="stat-value">{totalContributions}</span>
            <span className="stat-label">Contributions</span>
          </div>
          <div className="stat-pill">
            <span className="stat-value">{longestStreak}d</span>
            <span className="stat-label">Max Streak</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Stage */}
      <div className="github-calendar-stage" ref={stageRef}>
        {loading && !data ? (
          <div className="github-loading-skeleton">
            <div className="skeleton-pulse-bar" />
            <span>Loading live contribution data...</span>
          </div>
        ) : error && !data ? (
          <div className="github-error-box">
            <span>Unable to load live activity from GitHub right now.</span>
            <a 
              href={`https://github.com/${USERNAME}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="error-link"
            >
              View profile directly ↗
            </a>
          </div>
        ) : (
          <div className="github-svg-wrapper">
            <svg
              className="github-calendar-svg"
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              preserveAspectRatio="xMinYMin meet"
            >
              {/* Month Labels */}
              <g className="month-labels">
                {monthLabels.map(({ weekIndex, label }, idx) => (
                  <text
                    key={idx}
                    x={LEFT_PADDING + weekIndex * (SQUARE_SIZE + GAP)}
                    y={12}
                    className="calendar-month-text"
                  >
                    {label}
                  </text>
                ))}
              </g>

              {/* Day Labels (Mon, Wed, Fri) */}
              <g className="day-labels">
                <text x={0} y={TOP_PADDING + 1 * (SQUARE_SIZE + GAP) + 9} className="calendar-day-text">
                  Mon
                </text>
                <text x={0} y={TOP_PADDING + 3 * (SQUARE_SIZE + GAP) + 9} className="calendar-day-text">
                  Wed
                </text>
                <text x={0} y={TOP_PADDING + 5 * (SQUARE_SIZE + GAP) + 9} className="calendar-day-text">
                  Fri
                </text>
              </g>

              {/* Calendar Grid of Squares */}
              <g className="calendar-cells" transform={`translate(${LEFT_PADDING}, ${TOP_PADDING})`}>
                {weeks.map((week, wIdx) => (
                  <g key={wIdx} transform={`translate(${wIdx * (SQUARE_SIZE + GAP)}, 0)`}>
                    {week.map((day, dIdx) => {
                      if (!day) return null;
                      const level = day.level ?? 0;
                      return (
                        <rect
                          key={dIdx}
                          y={dIdx * (SQUARE_SIZE + GAP)}
                          width={SQUARE_SIZE}
                          height={SQUARE_SIZE}
                          rx={2.5}
                          ry={2.5}
                          className={`heat-cell level-${level}`}
                          data-level={level}
                          onMouseEnter={(e) => handleMouseEnter(e, day)}
                          onMouseLeave={handleMouseLeave}
                        />
                      );
                    })}
                  </g>
                ))}
              </g>
            </svg>
          </div>
        )}
      </div>

      {/* Card Footer: Profile Link + Legend */}
      <div className="github-heatmap-footer">
        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="github-profile-link"
        >
          <span>github.com/{USERNAME}</span>
          <span className="arrow-out">↗</span>
        </a>

        <div className="heatmap-legend">
          <span className="legend-label">Less</span>
          <span className="legend-cell level-0" />
          <span className="legend-cell level-1" />
          <span className="legend-cell level-2" />
          <span className="legend-cell level-3" />
          <span className="legend-cell level-4" />
          <span className="legend-label">More</span>
        </div>
      </div>

      {/* Custom Tooltip rendered at Card level so it never clips */}
      {tooltip.visible && (
        <div
          className="heatmap-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default GithubContributions;
