import { Post } from '../components/community/post/index';
import { MockPosts } from '../components/community/post/MockPosts';

const Feed = () => {
  return (
    <div>
      {MockPosts.map((post) => (
        <Post key={post.id} postData={post} isDisplayed />
      ))}
    </div>
  );
};
export default Feed;
