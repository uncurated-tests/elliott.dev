import chroma from 'chroma-js';
import { useTheme as emotionUseTheme } from 'emotion-theming';
import * as sun from 'suncalc';

import { css } from '@emotion/core';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  fonts: {
    body: string;
    heading: string;
  };
}

const BASE_FONT_SIZE_PX = 16;

/**
 * Convert a px value to the equivalent rem value, based on a font size of 16px.
 */
export const pxRem = (px: number) => `${px / BASE_FONT_SIZE_PX}rem`;

export const globalStyles = css`
  @import url('https://fonts.googleapis.com/css?family=Merriweather|Ubuntu&display=swap');
`;

/**
 * Given a datetime, determine the approximate longitude of its time zone.
 */
const approximateLongitudeFromTimezone = (datetime: Date) =>
  (-datetime.getTimezoneOffset() * 360) / (24 * 60);

/**
 * A mapping of the current time of day to a colour temperature, based on the current sun altitude
 * (solar elevation angle).
 * A warmer colour (3500K) is used during night time, and a cooler colour (6500K) during day time.
 *
 * See also:
 *  - https://en.wikipedia.org/wiki/Color_temperature
 *  - https://justgetflux.com/research.html
 *  - https://en.wikipedia.org/wiki/Solar_zenith_angle
 *  - https://github.com/mourner/suncalc
 */
const getDaylightTemperature = (datetime: Date) => {
  const MIN_TEMPERATURE_KELVINS = 3500;
  const MAX_TEMPERATURE_KELVINS = 6500;
  const TEMPERATURE_RANGE = MAX_TEMPERATURE_KELVINS - MIN_TEMPERATURE_KELVINS;
  const MAX_TEMPERATURE_ALTITUDE = Math.PI / 2 / 4;

  // If no location is provided by the user, assume their latitude as at the equator, and infer their
  // approximate longitude from their time zone.
  // TODO: determine user's location from browser APIs
  const { altitude: sunAltitude } = sun.getPosition(
    datetime,
    0 /* equator */,
    approximateLongitudeFromTimezone(datetime),
  );
  const temperature = sunAltitude * (TEMPERATURE_RANGE / MAX_TEMPERATURE_ALTITUDE);
  return Math.max(MIN_TEMPERATURE_KELVINS, Math.min(temperature, MAX_TEMPERATURE_KELVINS));
};

export const getTheme = (datetime: Date): Theme => {
  const backgroundColor = chroma.temperature(getDaylightTemperature(datetime));
  return {
    colors: {
      primary: '#635cb3',
      secondary: '#ffd615',
      background: backgroundColor.hex(),
      text: '#292929',
    },
    fonts: {
      body: "'Merriweather', serif",
      heading: "'Ubuntu', sans-serif",
    },
  };
};

export const useTheme = () => emotionUseTheme<Theme>();
