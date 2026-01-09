interface WeatherIconProps {
  icon: string;
  description: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-16 h-16",
  lg: "w-24 h-24"
};

export function WeatherIcon({
  icon,
  description,
  size = "md"
}: WeatherIconProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return <img src={iconUrl} alt={description} className={sizeClasses[size]} />;
}
