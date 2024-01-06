import { routes } from "@base/router/index";
import { InfoBlock } from "@components/info-block/info.block";
import { NavigationComponent } from "@components/navigation/navigation.component";
import { SpaceBackground } from "@components/space/space.background";

export const MainPage = () => {
  return (
    <div>
      <NavigationComponent />
      <SpaceBackground>
        {routes
          .filter((el) => el.path !== "/")
          .map((route) => (
            <InfoBlock
              key={route.id}
              gameplay={""}
              title={route.id}
              href={route.path}
            />
          ))}
      </SpaceBackground>
    </div>
  );
};
