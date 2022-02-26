#!/usr/bin/env -S deno run --quiet --allow-net=api.spacexdata.com --allow-read
/**
 * @file sxl.ts
 * @brief Obtain the 'latest' and 'next' SpaceX launches.
 *
 * @author     simon rowe <simon@wiremoons.com>
 * @license    open-source released under "MIT License"
 * @source     https://github.com/wiremoons/sxl
 *
 * @date originally created: 18 May 2021
 * @date updated significantly: 05 Sep 2021 and 22 Jan 2022
 *
 * @details Program obtains the 'latest' and 'next' SpaceX launches using the API from: https://github.com/r-spacex/SpaceX-API
 *
 * @note The program can be run with Deno using the command:
 * @code deno run --quiet --allow-read --allow-net=api.spacexdata.com ./sxl.ts
 *
 * @note The program can be compiled with Deno using the command:
 * @code deno compile --quiet --allow-read --allow-net=api.spacexdata.com ./sxl.ts
 */

//--------------------------------
// MODULE IMPORTS
//--------------------------------

import {toIMF} from "https://deno.land/std@0.127.0/datetime/mod.ts";
import {parse} from "https://deno.land/std@0.127.0/flags/mod.ts";
import {cliVersion} from "https://deno.land/x/deno_mod@0.7.5/cli_version.ts";
import {basename} from "https://deno.land/std@0.127.0/path/mod.ts";
import { underline,blue,green } from "https://deno.land/std@0.127.0/fmt/colors.ts";

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
  date_precision: string;
  payloadData?: string;
  launchPadData?: string;
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

/** Return the name of the currently running program without the path included. */
function getAppName(): string {
  return `${basename(Deno.mainModule) ?? "UNKNOWN"}`;
}

//--------------------------------
// COMMAND LINE ARGS FUNCTIONS
//--------------------------------

/** Define the command line argument switches and options to be used */
const cliOpts = {
  default: { l: false, h: false, n:false, v: false },
  alias: { l: "last", h: "help", n: "next", v: "version" },
  stopEarly: true,
  unknown: showUnknown,
};

/** define options for `cliVersion()` function for application version data */
const versionOptions = {
  version: "0.3.0",
  copyrightName: "Simon Rowe",
  licenseUrl: "https://github.com/wiremoons/sxl/",
  crYear: "2022",
};

/** obtain any command line arguments and exec them as needed */
async function getCliArgs() {
  //console.log(parse(Deno.args,cliOpts));
  const cliArgs = parse(Deno.args, cliOpts);

  if (cliArgs.latest) {
    //
    console.log("TODO: execute and show 'last' launch only.")
    Deno.exit(0);
  }

  if (cliArgs.next) {
    //
    console.log("TODO: execute and show 'next' launch only.")
    Deno.exit(0);
  }

  if (cliArgs.help) {
    showHelp();
    Deno.exit(0);
  }

  if (cliArgs.version) {
    const versionData = await cliVersion(versionOptions);
    console.log(versionData);
    Deno.exit(0);
  }
}

/** Function defined in `cliOpts` so is run automatically by `parse()` if an unknown
 * command line option is given by the user.
 * @code showUnknown(arg: string, k?: string, v?: unknown)
 */
function showUnknown(arg: string) {
  console.error(`\nERROR: Unknown argument: '${arg}'`);
  showHelp();
  Deno.exit(1);
}

/** Help display for application called when unknown command lines options are entered */
function showHelp() {
  console.log(`
  
${getAppName()} obtains the 'latest' and 'next' SpaceX launches using the API 
from: https://github.com/r-spacex/SpaceX-API

Usage: ${getAppName()} [switches] [arguments]

[Switches]       [Arguments]   [Default Value]   [Description]
-l, --last                          false        only display data for the last launch               
-h, --help                          false        display help information
-n, --next                          false        only display data for the next launch  
-v, --version                       false        display program version
`);
}


//--------------------------------
// APPLICATION FUNCTIONS
//--------------------------------

/** Download launch data and extract into a 'Launch' record.
 * @param url for either 'last' or 'next' launch data to `fetch`
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
  return {
    flightNumber: launchJSON["flight_number"],
    flightName: launchJSON["name"],
    details: launchJSON["details"],
    dateEpoch: launchJSON["date_unix"],
    payloads: launchJSON["payloads"],
    launchpad: launchJSON["launchpad"],
    success: launchJSON["success"],
    date_precision: launchJSON["date_precision"],
  };

  // debug output
  //console.info(JSON.stringify(flightData));

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
    Deno.exit(3);
  }

  const payloadJSON = await response.json();

  return `Payload is: ${payloadJSON["name"] || "UNKNOWN name"} (${
    payloadJSON["type"] || "UNKNOWN type"
  }) for customer: ${payloadJSON["customers"] || "UNKNOWN customer"}. Payload manufactured by: ${
    payloadJSON["manufacturers"] || "UNKNOWN manufacture"}.`;

}


/** Obtain launchpad data and extract into a 'launchPadData' string
 * @note LaunchPad data URL:
 * @code https://api.spacexdata.com/v4/launchpads/:id
 * @code https://api.spacexdata.com/v4/launchpads/5e9e4502f509092b78566f87
 */

async function getLaunchPadData(url: string): Promise<string> {
  // TODO: move `fetch` to own function as used multiple time in other functions
  const response = await fetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    console.error("\nERROR: unable to obtain website launchpad data");
    console.error(
        `Sever response: '${response.statusText}' (Code: '${response.status}')`,
    );
    console.error("Exit.");
    Deno.exit(2);
  }

  const launchpadJSON = await response.json();

  return `${launchpadJSON["full_name"] || "UNKNOWN name"} ${launchpadJSON["region"] || "UNKNOWN region"}. Launched ${launchpadJSON["launch_successes"] || "UNKNOWN"} of ${
      launchpadJSON["launch_attempts"] || "UNKNOWN"} attempts.`;

  // debug output
  //console.info(JSON.stringify(launchpadData));
  //console.info(JSON.stringify(launchpadJSON));

}



/** Output the obtained flight records information */
function displayFlightRecord(launchData: Launch, launchTitle: string) {
  const launchPrecision = (launchTitle.includes("Next")) ? `[Precision: ${launchData.date_precision.toUpperCase()}]` : ""
  const LaunchKind = (launchTitle.includes("Next")) ? `${blue(launchTitle)}` : `${green(launchTitle)}`
  // Output final launch information to the screen
  console.log(`
${LaunchKind} SpaceX Launch 🚀

Flight Number     : ${launchData.flightNumber}
Flight Name       : ${launchData.flightName}
Launchpad         : ${launchData.launchPadData}
Launch Date       : ${launchData.displayDate} ${launchPrecision}
Flight Successful : ${launchData.success || "Awaiting launch"} 

Payload Details:
${launchData.payloadData || "Unknown"}

Flight Details:
${launchData.details || "None available"}

`);
}

//--------------------------------
// MAIN
//--------------------------------
if (import.meta.main) {

  if (Deno.args.length > 0) await getCliArgs();

  //TODO: run both request at same time instead of sequentially
  //TODO: link separate requests to command line options 'last' and 'next'
  console.log("");
  console.log(`${underline("SpaceX - Rocket Launch Information")}`);

  // LAST LAUNCH
  // get the 'last' launch
  const latestLaunch: Launch = await getLaunchData(
    "https://api.spacexdata.com/v4/launches/latest",
  );
  // display 'next' launch information
  setDisplayDate(latestLaunch);
  latestLaunch.payloadData = await getPayloadData(
    `https://api.spacexdata.com/v4/payloads/${latestLaunch.payloads}`,
  );
  latestLaunch.launchPadData = await getLaunchPadData(
      `https://api.spacexdata.com/v4/launchpads/${latestLaunch.launchpad}`,
  );
  displayFlightRecord(latestLaunch, "Latest");

  // NEXT LAUNCH
  // get the 'next' scheduled launch
  const nextLaunch: Launch = await getLaunchData(
    "https://api.spacexdata.com/v4/launches/next",
  );
  // display 'next' launch information
  setDisplayDate(nextLaunch);
  nextLaunch.payloadData = await getPayloadData(
    `https://api.spacexdata.com/v4/payloads/${nextLaunch.payloads}`,
  );
  nextLaunch.launchPadData = await getLaunchPadData(
      `https://api.spacexdata.com/v4/launchpads/${nextLaunch.launchpad}`,
  );
  displayFlightRecord(nextLaunch, "Next Scheduled");
}
