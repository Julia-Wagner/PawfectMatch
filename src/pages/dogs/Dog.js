import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import styles from "../../styles/Post.module.css"
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import {Link, useNavigate} from "react-router-dom";
import {MoreDropdown} from "../../components/MoreDropdown";
import {axiosReq, axiosRes} from "../../api/axiosDefaults";
import ConfirmationModal from "../../components/ConfirmationModal";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import Asset from "../../components/Asset";
import {fetchMoreData} from "../../utils/utils";
import appStyles from "../../App.module.css";
import {toast} from "react-toastify";

const Dog = (props) => {
    const {
        id,
        owner,
        is_owner,
        owner_name,
        birthday_formatted,
        age,
        breed,
        characteristics_names,
        gender,
        is_adopted,
        name,
        size,
        description,
        main_image,
        updated_at,
        dogPage,
        profile_id,
        owner_phone,
        owner_address,
        owner_mail_address,
        additional_images,
        video,
    } = props;

    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const [dogPosts, setDogPosts] = useState({ results: [] });
    const [additionalImages, setAdditionalImages] = useState([]);
    useEffect(() => {
        setAdditionalImages(additional_images || []);
    }, [additional_images]);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const [{ data: dogPosts }] = await Promise.all([
                        axiosReq.get(`/posts/?dogs__id=${id}`),
                    ]);
                    setDogPosts(dogPosts);
                } catch (err) {
                    let message = "Error, please try again later.";
                    if (err.response?.data?.detail) {
                        message = err.response?.data?.detail;
                    } else if (err.message) {
                        message = err.message;
                    }
                    toast.error(message);
                }
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (main_image && main_image.url) {
            setImageUrl(main_image.url);
        }
    }, [main_image]);

    // Sanitize HTML content to prevent security issues
    const sanitizedDescription = React.useMemo(() => {
        return { __html: DOMPurify.sanitize(description) };
    }, [description]);

    const handleEdit = () => {
        navigate(`/dogs/${id}/edit`);
    };

    const handleDelete = async () => {
        setShowConfirmation(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosRes.delete(`/dogs/${id}/`);
            navigate("/feed");
            toast.success("Dog deleted successfully");
        } catch (err) {
            let message = "Error, please try again later.";
            if (err.response?.data?.detail) {
                message = err.response?.data?.detail;
            } else if (err.message) {
                message = err.message;
            }
            toast.error(message);
        }
    };

    return (
        <Card className={styles.Post}>
            <Card.Body className="d-flex justify-content-between flex-wrap">
                <div>
                    {is_adopted ? (
                        <Badge pill bg="success">
                            Found a home
                        </Badge>
                    ) : (
                        <Badge pill bg="danger">
                            Looking for a home
                        </Badge>
                    )}
                </div>
                <div className="d-flex align-items-center gap-3">
                    <span>{updated_at}</span>
                    {is_owner && dogPage && (
                        <MoreDropdown
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
            </Card.Body>
            <Link to={`/dogs/${id}`}>
                <div className={styles.SquareContainer}>
                    <Image className={styles.SquareImage} src={imageUrl} width="100%" alt={name} />
                </div>
            </Link>
            <Card.Body>
                {name && <h2 className="text-center">{name}</h2>}
                {sanitizedDescription && !dogPage && <Card.Text
                    className={styles.Truncate}
                    dangerouslySetInnerHTML={sanitizedDescription}
                />}
                {sanitizedDescription && dogPage && <Card.Text
                    dangerouslySetInnerHTML={sanitizedDescription}
                />}
                {!dogPage && <div className="text-center"><Card.Link href={`/dogs/${id}`}>View dog</Card.Link></div>}
                {dogPage &&
                    <Container className={styles.DogDetails}>
                        <Row>
                            <Col className="py-2 p-0 p-lg-2" md={4}>
                                <i className={`fa-solid fa-dog ${appStyles.Icon}`}/> {breed}
                            </Col>
                            <Col className="py-2 p-0 p-lg-2" md={4}>
                                <i className={`fa-solid fa-weight-scale ${appStyles.Icon}`}/> {size}
                            </Col>
                            <Col className="py-2 p-0 p-lg-2" md={4}>
                                <i className={`fa-solid fa-venus-mars ${appStyles.Icon}`}/> {gender}
                            </Col>
                        </Row>
                        <Row>
                            <Col className="py-2 p-0 p-lg-2">
                                <i className={`fa-solid fa-cake-candles ${appStyles.Icon}`}/> {birthday_formatted} ({age})
                            </Col>
                        </Row>
                        {characteristics_names && characteristics_names.length > 0 &&
                            <div className="mt-4 mb-5 d-flex gap-3 flex-wrap">
                                {characteristics_names.map((char, index) => (
                                    <div className={appStyles.Characteristic} key={index}>{char.characteristic}</div>
                                ))}
                            </div>
                        }
                        <hr/>

                        {additionalImages.length > 0 && (
                            <>
                                <h3 className="text-center">Additional images for {name}</h3>
                                <Carousel className="my-3">
                                    {additional_images.map((imageData) => (
                                        <Carousel.Item key={imageData.id} interval={5000}>
                                            <Image src={imageData.image} alt={imageData.name} fluid />
                                            <Carousel.Caption className={styles.CarouselCaption}>
                                                <h4 className={styles.CarouselHeading}>{imageData.name}</h4>
                                                <p className={styles.CarouselParagraph}>{imageData.description}</p>
                                            </Carousel.Caption>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                                <hr/>
                            </>
                        )}

                        {video && video.url && (
                            <>
                                <h3 className="text-center">Video for {name}</h3>
                                <video controls className={`${appStyles.Video} d-block mx-auto`}>
                                    <source src={video.url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <hr/>
                            </>
                        )}

                        <div className="mb-5 mt-4">
                            {owner &&
                                <Link to={`/profiles/${profile_id}`}>
                                    <h3 className="text-center">{owner_name}</h3>
                                </Link>
                            }
                            <Row>
                                {owner_phone &&
                                    <Col className="py-2 p-0 p-lg-2">
                                        <i className={`fa-solid fa-phone ${appStyles.Icon} ${appStyles.BlueIcon}`}/> {owner_phone}
                                    </Col>
                                }
                            </Row>
                            <Row>
                                {owner_mail_address &&
                                    <Col className="py-2 p-0 p-lg-2">
                                        <i className={`fa-solid fa-envelope ${appStyles.Icon} ${appStyles.BlueIcon}`}/> {owner_mail_address}
                                    </Col>
                                }
                            </Row>
                            <Row>
                                {owner_address &&
                                    <Col className="py-2 p-0 p-lg-2">
                                        <i className={`fa-solid fa-location-dot ${appStyles.Icon} ${appStyles.BlueIcon}`}/> {owner_address}
                                    </Col>
                                }
                            </Row>
                        </div>
                        {dogPosts.results && dogPosts.results.length > 0 && (
                            <div className="mb-5 mt-4">
                                <hr />
                                <h3 className={styles.LinkHeading}>Posts linked to {name}</h3>
                                <hr />
                                <InfiniteScroll
                                    dataLength={dogPosts.results.length}
                                    loader={<Asset spinner />}
                                    hasMore={!!dogPosts.next}
                                    next={() => fetchMoreData(dogPosts, setDogPosts)}>
                                    {dogPosts.results.map((post) => (
                                        <Post key={post.id} {...post} setPosts={setDogPosts} />
                                    ))}
                                </InfiniteScroll>
                            </div>
                        )}
                    </Container>
                }
            </Card.Body>
            <ConfirmationModal title="Confirm deletion" text="Are you sure you want to delete this dog?"
                show={showConfirmation}
                onHide={() => setShowConfirmation(false)}
                onConfirm={handleConfirmDelete}
            />
        </Card>
    )
}

Dog.propTypes = {
    id: PropTypes.number,
    owner: PropTypes.string,
    is_owner: PropTypes.bool,
    owner_name: PropTypes.string,
    birthday_formatted: PropTypes.string,
    age: PropTypes.string,
    breed: PropTypes.string,
    characteristics_names: PropTypes.array,
    gender: PropTypes.string,
    is_adopted: PropTypes.bool,
    name: PropTypes.string,
    size: PropTypes.string,
    description: PropTypes.string,
    main_image: PropTypes.shape({
        url: PropTypes.string
    }),
    updated_at: PropTypes.string,
    dogPage: PropTypes.bool,
    profile_id: PropTypes.number,
    owner_phone: PropTypes.string,
    owner_mail_address: PropTypes.string,
    owner_address: PropTypes.string,
    additional_images: PropTypes.array,
    video: PropTypes.object,
};

export default Dog