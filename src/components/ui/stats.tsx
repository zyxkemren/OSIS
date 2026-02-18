"use client";

import React, { useState, useEffect } from "react";
import { DescriptionText } from "./text";
import Image from "next/image";
import Select from "react-select";
import { HStack, Stack, Text } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@/components/ui/pagination";

const customStyles = {
  placeholder: (base) => ({
    ...base,
    color: "#333333",
  }),
  control: (base) => ({
    ...base,
    backgroundColor: "#17181f",
    border: "none",
    borderRadius: "10px",
    width: "300px",
    height: "50px",
    fontSize: "1em",
    padding: "0 5px",
    margin: "10px 0 0",
    color: "f9f9f9",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "#272934",
    width: "2px",
  }),
  option: (base, state) => ({
    ...base,
    padding: "9px 15px",
    backgroundColor: state.isFocused ? "#222327" : "#15161b",
    color: "#f9f9f9",
    fontSize: "1em",
    "&:active": {
      backgroundColor: "#007bff",
      color: "white",
    },
  }),
  menu: (base) => ({
    ...base,
    width: 300,
    backgroundColor: "#17181f",
  }),
  menuList: (base) => ({
    ...base,
    width: 300,
    maxHeight: "170px",
    padding: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#f9f9f9",
  }),
};

export function StatsDisplay({ data }) {
  return (
    <div>
      <div
        className="stats-display"
        style={{
          backgroundColor: "var(--primary-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 20px",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            margin: "20px 7vw",
            width: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>total earnings</span>
          <h1>{data.income ? (data.income / 1000).toLocaleString("id-ID") + "K" : 0}</h1>
          <span className="stats-changes plus">{data.margin_income ? data.margin_income + "K" : null}</span>
        </div>
        <span style={{ width: "2px", height: "100px", backgroundColor: "var(--body-color)" }}></span>
        <div
          style={{
            textAlign: "center",
            margin: "20px 7vw",
            width: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>total visit</span>
          <h1>{data.visit ? data.visit : 0}</h1>
          <span className="stats-changes mins">{data.margin_visit}</span>
        </div>
      </div>
      <DescriptionText text="analytics for this month" upper={true} style={{ fontWeight: "600" }} />
    </div>
  );
}

export function Leaderboard({ data }) {
  const [avatars, setAvatars] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(data?.[0] || null); // Default to the first option if data exists

  const handleSelectChange = (selected) => {
    const newOption = data.find((option) => option.value === selected.value);
    setSelectedOption(newOption);
  };

  useEffect(() => {
    handleSelectChange({ value: "all_time", label: "All time" });
  }, [data]);

  useEffect(() => {
    const fetchAvatars = async () => {
      setLoading(true);
      setError(null);

      try {
        if (selectedOption && selectedOption.data) {
          const avatarPromises = selectedOption.data.map(async (player) => {
            const response = await fetch(`https://mc-heads.net/avatar/${player.name}`);
            if (!response.ok) {
              throw new Error(`Error fetching avatar for ${player.name}`);
            }
            return { id: player.id, avatarUrl: response.url };
          });

          const avatarData = await Promise.all(avatarPromises);
          const avatarMap = avatarData.reduce((acc, curr) => {
            acc[curr.id] = curr.avatarUrl;
            return acc;
          }, {});

          setAvatars(avatarMap);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatars();
  }, [selectedOption]);

  return (
    <div>
      <h2>Leaderboard</h2>
      <div
        className="stats-leaderboard"
        style={{
          backgroundColor: "var(--primary-color)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "10px 20px",
          marginTop: "20px",
          borderRadius: "10px",
        }}
      >
        <Select
          options={data.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          onChange={handleSelectChange}
          styles={customStyles}
          placeholder="Select Time"
        />
        <div style={{ margin: "20px 0" }}>
          {loading ? (
            <p key={1}>Loading avatars...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : !selectedOption || !selectedOption.data ? (
            <p>No data available</p>
          ) : (
            selectedOption.data.map((data) => (
              <div
                key={data.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "15px 5px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image
                    src={avatars[data.id] || "https://mc-heads.net/avatar/steve"}
                    alt={`${data.name}'s avatar`}
                    width={40}
                    height={40}
                    style={{ borderRadius: "10px", marginRight: "10px" }}
                  />
                  <span style={{ fontWeight: "500" }}>{data.name}</span>
                </div>
                <span style={{ fontWeight: "600" }}>{"IDR " + data.totalcoin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <DescriptionText text="refresh to update leaderboard" upper={true} style={{ fontWeight: "600" }} />
    </div>
  );
}

export function StatsTotal({ data }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(data?.[0] || null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSelectChange = (selected) => {
    const newOption = data.find((option) => option.value === selected.value);
    setSelectedOption(newOption);
    setCurrentPage(1);
  };

  useEffect(() => {
    handleSelectChange({ value: "all_time", label: "All time" });
  }, [data]);

  const currentData = selectedOption?.data?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil((selectedOption?.data?.length || 0) / itemsPerPage);
  console.log(totalPages);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div>
      <h2>Total Earnings</h2>
      <div
        className="stats-total"
        style={{
          backgroundColor: "var(--primary-color)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "10px 20px",
          marginTop: "20px",
          borderRadius: "10px",
        }}
      >
        <Select
          options={data.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          onChange={handleSelectChange}
          styles={customStyles}
          placeholder="Select Time"
        />
        <div style={{ margin: "20px 0" }}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : !selectedOption || !selectedOption.data ? (
            <p>No data available</p>
          ) : (
            <>
              <PaginationRoot count={totalPages} pageSize={1} page={currentPage} onPageChange={(e) => setCurrentPage(e.page)}>
                {currentData.map((data) => (
                  <div
                    key={data.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "15px 5px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ fontWeight: "500" }}>{data.id}</span>
                    </div>
                    <span style={{ fontWeight: "600" }}>{`IDR ${data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</span>
                  </div>
                ))}
                <HStack justify="center" gap={4} style={{ marginTop: "20px" }}>
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </PaginationRoot>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
