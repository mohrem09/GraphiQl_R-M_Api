import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';



const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache()
});

const CHARACTERS_QUERY = gql`
  query Characters($page: Int!) {
    characters(page: $page) {
      results {
        id
        name
        image
      }
    }
  }
`;

const CharacterList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const { loading, error, data } = useQuery(CHARACTERS_QUERY, {
    variables: { page }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCharacterClick = (id: string) => {
    setSelectedCharacter(id);
  };

  return (
    <div>
      <h2>Character List</h2>
      {data.characters.results.map((character: { id: string, name: string, image: string }) => (
        <div key={character.id} onClick={() => handleCharacterClick(character.id)}>
          <img src={character.image} alt={character.name} />
          <p>{character.name}</p>
        </div>
      ))}
      <button onClick={() => setPage(page + 1)}>Next Page</button>

      {selectedCharacter && (
        <div>
          <h2>Character Details</h2>
          <div>
            <CharacterDetails characterId={selectedCharacter} />
          </div>
        </div>
      )}
    </div>
  );
};

const CharacterDetails: React.FC<{ characterId: string }> = ({ characterId }) => {
  const { loading, error, data } = useQuery(gql`
    query Character($id: ID!) {
      character(id: $id) {
        id
        name
        image
      }
    }
  `, {
    variables: { id: characterId }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const character = data.character;

  return (
    <div>
      <h2>{character.name}</h2>
      <img src={character.image} alt={character.name} />
      {/* Afficher d'autres détails du personnage ici si nécessaire */}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <CharacterList />
    </ApolloProvider>
  );
};

export default App;
