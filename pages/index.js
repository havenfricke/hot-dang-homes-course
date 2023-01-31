import { gql } from "@apollo/client";
import client from "client";
import { BlockRenderer } from "components/BlockRenderer/BlockRenderer";
import { MainMenu } from "components/MainMenu";
import { cleanAndTransformBlocks } from "utils/cleanAndTransformBlocks";
import { mapMainMenuItems } from "utils/mapMainMenuItems";

export default function Home(props) {
  console.log("props", props);
  return <div>
          <MainMenu 
          items={props.mainMenuItems} 
          callToActionDestination={props.callToActionDestination}
          callToActionLabel={props.callToActionLabel}/>
          <BlockRenderer blocks={props.blocks}/>
          </div>;
}

export const getStaticProps = async () => {
  const {data} = await client.query({
    query: gql`
    query PageQuery {
      nodeByUri(uri: "/") {
          ... on Page {
            id
            title
            blocksJSON
        }
      }
      acfOptionsMainMenu {
        mainMenu {
          callToActionButton {
            label
            destination {
              ... on Page{
                uri
              }
            }
          }
          menuItems {
            menuItem {
              destination {
                ... on Page {
                  uri
                }
              }
              label
            }
            items {
              destination {
                ... on Page {
                  uri
                }
              }
              label
            }
          }
        }
      }
    }
    `,
  });
  const blocks = cleanAndTransformBlocks(data.nodeByUri.blocksJSON);
  return {
   
    props: {
      blocks,
      callToActionLabel: data.acfOptionsMainMenu.mainMenu.callToActionButton.label,
      callToActionDestination: data.acfOptionsMainMenu.mainMenu.callToActionButton.destination.uri,
      mainMenuItems: mapMainMenuItems(
        data.acfOptionsMainMenu.mainMenu.menuItems
        ), 
    },
  };
};