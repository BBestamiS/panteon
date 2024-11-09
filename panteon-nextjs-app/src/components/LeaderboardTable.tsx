import React, { useState } from 'react';
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import SortableColumn from './SortableColumn';
import CountryFlag from 'react-country-flag';
import Select from 'react-select';
import { FaLayerGroup } from 'react-icons/fa';
import { columns as initialColumns } from '../data/columnsData';

interface Player {
  playerId: string;
  playerName: string;
  country: string;
  balance: string;
  score: string;
  rank: number;
}

const countryCodeMap: { [key: string]: string } = {
  "USA": "US",
  "India": "IN",
  "Germany": "DE",
  "Japan": "JP",
  "Brazil": "BR",
  "Spain": "ES",
  "Australia": "AU",
  "Italy": "IT",
  "Sweden": "SE",
  "Turkey": "TR",
  "France": "FR",
  "UK": "GB",
  "Canada": "CA",
  "China": "CN",
  "South Korea": "KR"
};

const groupByCountry = (players: Player[]) => {
  return players.reduce((groups, player) => {
    const country = player.country;
    if (!groups[country]) {
      groups[country] = [];
    }
    groups[country].push(player);
    return groups;
  }, {} as { [country: string]: Player[] });
};

const LeaderboardTable: React.FC<{ players: Player[], highlightedRank?: number }> = ({ players, highlightedRank }) => {
  const [columns, setColumns] = useState(initialColumns);
  const [isGroupedByCountry, setIsGroupedByCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const getFilteredAndSortedPlayers = () => {
    let filteredPlayers = players;
    
    if (isGroupedByCountry) {
      filteredPlayers = filteredPlayers.slice(0, 100);
    }

    if (selectedCountry) {
      filteredPlayers = players.filter(player => player.country === selectedCountry);
      return [{
        country: selectedCountry,
        players: filteredPlayers.map((player, index) => ({
          ...player,
          localRank: index + 1
        }))
      }];
    }

    if (isGroupedByCountry) {
      const grouped = groupByCountry(filteredPlayers);
      return Object.entries(grouped).map(([country, playersInCountry]) => ({
        country,
        players: playersInCountry.map((player, index) => ({
          ...player,
          localRank: index + 1
        }))
      }));
    }

    return [{
      country: null,
      players: filteredPlayers.map(player => ({
        ...player,
        localRank: player.rank
      }))
    }];
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active) return;

    if (active.id !== over.id) {
      const oldIndex = columns.findIndex((column) => column.id === active.id);
      const newIndex = columns.findIndex((column) => column.id === over.id);
      setColumns(arrayMove(columns, oldIndex, newIndex));
    }
  };

  const toggleGroupByCountry = () => {
    setIsGroupedByCountry(!isGroupedByCountry);
    setSelectedCountry(null);
  };

  const handleCountrySelect = (option: { value: string | null, label: JSX.Element }) => {
    setSelectedCountry(option.value);
    setIsGroupedByCountry(false);
  };

  const uniqueCountries = Array.from(new Set(players.map(player => player.country)));

  const countryOptions = [
    { value: null, label: 'Show All' },
    ...uniqueCountries.map(country => ({
      value: country,
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CountryFlag
            countryCode={countryCodeMap[country] || ''}
            svg
            style={{ marginRight: 5 }}
          />
          <span>{country}</span>
        </div>
      )
    }))
  ];

  const filteredAndSortedPlayers = getFilteredAndSortedPlayers();

  return (
    <div className="container">
      <div className="control-panel">
        <button className="group-toggle-button" onClick={toggleGroupByCountry}>
          <FaLayerGroup className="group-icon" />
          {isGroupedByCountry ? 'Ungroup' : 'Group by Country'}
        </button>

        <Select
          options={countryOptions}
          onChange={(option) => handleCountrySelect(option as { value: string | null, label: JSX.Element })}
          defaultValue={countryOptions[0]}
          className="country-select"
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: '#1C172B ',
              color: '#fff',
              borderColor: '#444',
            }),
            singleValue: (provided) => ({
              ...provided,
              color: '#fff',
            }),
            option: (provided, { isFocused }) => ({
              ...provided,
              backgroundColor: isFocused ? '#333' : '#1C172B ',
              color: '#fff',
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: '#1C172B ',
              color: '#fff',
            })
          }}
        />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="table-container">
          <table className="table">
            <thead>
              <SortableContext items={columns} strategy={horizontalListSortingStrategy}>
                <tr>
                  {columns.map((column) => (
                    <SortableColumn key={column.id} column={column} />
                  ))}
                </tr>
              </SortableContext>
            </thead>
            <tbody>
              {filteredAndSortedPlayers.map(({ country, players }) => (
                <React.Fragment key={country || 'all'}>
                  {country && players.length > 0 && (
                    <tr className="table-head">
                      <td colSpan={columns.length} className="table-cell">
                        {country}
                      </td>
                    </tr>
                  )}
                  {players.map((player) =>
                    Object.values(player).some((val) => val) ? (
                      <tr
                        key={player.playerId}
                        className={`table-row ${highlightedRank === player.rank ? 'highlighted-row' : ''} ${player.localRank % 2 === 0 ? 'table-row-even' : 'table-row-odd'}`}
                      >
                        {columns.map((column) => (
                          <td key={column.id} className={`table-cell ${column.id}-column`}>
                            {column.id === 'ranking' && player.localRank}
                            {column.id === 'playerName' && player.playerName}
                            {column.id === 'country' && (
                              <>
                                <CountryFlag
                                  countryCode={countryCodeMap[player.country] || ''}
                                  svg
                                  style={{ marginRight: 5 }}
                                />
                                {player.country}
                              </>
                            )}
                            {column.id === 'money' && (
                              <span >
                                {player.balance}
                              </span>
                            )}
                            {column.id === 'score' && <span>{player.score}</span>}
                          </td>
                        ))}
                      </tr>
                    ) : (
                      <tr key={`spacer-${player.playerId}`} className="spacer-row">
                        <td colSpan={columns.length} className="table-cell-spacer">...</td>
                      </tr>
                    )
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </DndContext>
    </div>
  );
};

export default LeaderboardTable;
