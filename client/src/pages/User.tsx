import { Grid, GridItem } from '@chakra-ui/react';
import { InfoCard } from '../components';

const userInfoProps = {
    avatar: {
        src: '../public/images/1989-Taylors-Version.webp',
        username: 'Taylor Swift',
    },
    email: 'taylorswift@gmail.com',
    phone: '+1 (202) 444 1989',
    address: {
        city: 'Nashville',
        state: 'Tennessee',
        country: 'USA',
        zipcode: '37208',
    },
};
function User() {
    return (
        <Grid templateColumns={'repeat(2,1fr)'} width="full" height="full">
            <GridItem>
                <InfoCard {...userInfoProps} />
            </GridItem>
        </Grid>
    );
}

export default User;
