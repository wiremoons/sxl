#!/usr/bin/env -S deno run --quiet --allow-net=api.spacexdata.com
/**
 * @file sxl.ts
 * @brief Obtain the 'latest' and 'next' SpaceX launches.
 *
 * @author     simon rowe <simon@wiremoons.com>
 * @license    open-source released under "MIT License"
 * @source     https://github.com/wiremoons/sxl
 *
 * @date originally created: 18 May 2021
 * @date updated significantly: 05 Sep 2021
 *
 * @details Program obtains the 'latest' and 'next' SpaceX launches using the API from: https://github.com/r-spacex/SpaceX-API
 *
 * @note The program can be run with Deno using the command:
 * @code deno run --quiet --allow-net=api.spacexdata.com ./sxl.ts
 *
 * @note The program can be compiled with Deno using the command:
 * @code deno compile --quiet --allow-net=api.spacexdata.com ./sxl.ts
 */

//--------------------------------
// MODULE IMPORTS
//--------------------------------

import { toIMF } from "https://deno.land/std@0.106.0/datetime/mod.ts";

//--------------------------------
// INTERFACES
//--------------------------------
interface Launch {
  flightNumber: number;
  flightName: string;
  details: string;
  dateEpoch: number;
  payloads: number;
  launchpad: number;
  success: boolean;
  payloadData?: string;
  displayDate?: string;
}

//--------------------------------
// UTILITY FUNCTIONS
//--------------------------------

//
//  Convert epoch date of launch to date for display in output
//
function setDisplayDate(launchData: Launch) {
  //console.log(`Epoch date for conversion: ${launchData.dateEpoch}`);
  let dateUTC: Date;
  if (launchData.dateEpoch) {
    dateUTC = new Date(launchData.dateEpoch * 1000);
    //console.log(`Converted date to UTC format: ${dateUTC}`);
    launchData.displayDate = toIMF(new Date(dateUTC));
    //console.log(`Final format: ${toIMF(new Date(dateUTC))}`);
  } else {
    console.error("\nWARNING: no 'launchData.dateEpoch' value exists.\n");
    launchData.displayDate = "UNKNOWN";
  }
}

//--------------------------------
// APPLICATION FUNCTIONS
//--------------------------------

/** Download launch data and extract into a 'Launch' record.
 * @param url : the url for either 'last' or 'next' launch data to `fetch`
 * @returns Promise<Launch> : populated `Launch` interface object using fetched data.
 * @note Next scheduled launch URL:
 * @code https://api.spacexdata.com/v4/launches/next
 */
async function getLaunchData(url: string): Promise<Launch> {
  // TODO: move `fetch` to own function as used multiple time in other functions
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    console.error("\nERROR: unable to obtain website launch data");
    console.error(
      `Sever response: '${response.statusText}' (Code: '${response.status}')`,
    );
    // TODO: return empty `Launch` here instead of exiting so Promise is met.
    console.error("Exit.");
    Deno.exit(1);
  }

  const launchJSON = await response.json();

  // extract JSON record into `Launch` interface
  const flightData: Launch = {
    flightNumber: launchJSON["flight_number"],
    flightName: launchJSON["name"],
    details: launchJSON["details"],
    dateEpoch: launchJSON["date_unix"],
    payloads: launchJSON["payloads"],
    launchpad: launchJSON["launchpad"],
    success: launchJSON["success"],
  };

  // debug output
  //console.info(JSON.stringify(flightData));

  return flightData;
}

/** Obtain payload data and extract into a 'Payload' string
 * @note Payload data URL:
 * @code https://api.spacexdata.com/v4/payloads/:id
 * @code https://api.spacexdata.com/v4/payloads/60428afbc041c16716f73cdd
 */

async function getPayloadData(url: string): Promise<string> {
  // TODO: move `fetch` to own function as used multiple time in other functions
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    console.error("\nERROR: unable to obtain website payload data");
    console.error(
      `Sever response: '${response.statusText}' (Code: '${response.status}')`,
    );
    console.error("Exit.");
    Deno.exit;
  }

  const payloadJSON = await response.json();

  // extract record
  // TODO: return 'UNKNOWN' if any JSON data fields are empty
  const payloadData = `Payload is: ${payloadJSON["name"]} (${
    payloadJSON["type"]
  }) for customer: ${payloadJSON["customers"]}. Payload manufactured by: ${
    payloadJSON["manufacturers"]
  }.`;

  // debug output
  //console.info(JSON.stringify(payloadData));
  //console.info(JSON.stringify(payloadJSON));

  return payloadData;
}

/** Output the obtained flight records information */
function displayFlightRecord(launchData: Launch, launchTitle: string) {
  console.log(`
${launchTitle} SpaceX Launch 🚀

Flight Number     : ${launchData.flightNumber}
Flight Name       : ${launchData.flightName}
Planned Date      : ${launchData.displayDate}
Flight Successful : ${launchData.success || "Not Applicable"}

Flight Details:
${launchData.details || "None available"}

Payload Details:
${launchData.payloadData || "Unknown"}
`);
}

//--------------------------------
// MAIN
//--------------------------------
if (import.meta.main) {
  //TODO: run both request at same time instead of sequentially
  console.log("");
  console.log("SpaceX  -  Rocket  Launch  Information");
  console.log("¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯");

  // LAST LAUNCH
  // get the 'last' launch
  const latestLaunch: Launch = await getLaunchData(
    "https://api.spacexdata.com/v4/launches/latest",
  );
  // display 'next' lauch information
  setDisplayDate(latestLaunch);
  latestLaunch.payloadData = await getPayloadData(
    `https://api.spacexdata.com/v4/payloads/${latestLaunch.payloads}`,
  );
  displayFlightRecord(latestLaunch, "Latest");

  // NEXT LAUNCH
  // get the 'next' scheduled launch
  const nextLaunch: Launch = await getLaunchData(
    "https://api.spacexdata.com/v4/launches/next",
  );
  // display 'next' lauch information
  setDisplayDate(nextLaunch);
  nextLaunch.payloadData = await getPayloadData(
    `https://api.spacexdata.com/v4/payloads/${nextLaunch.payloads}`,
  );
  displayFlightRecord(nextLaunch, "Next Scheduled");
}
