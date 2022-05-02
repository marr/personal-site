import groupBy from 'lodash/groupBy';
import type { TweetProps } from '~/api/twitter';



export default function formatTwitter ({ data, includes }: any) {

    
    
    return Object.values(convos).map(convo => formatConversation(convo));
}